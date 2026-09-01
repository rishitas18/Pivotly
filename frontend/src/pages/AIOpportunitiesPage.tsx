import { useEffect } from "react";
import { Link } from "react-router-dom";
import { OpportunityCard } from "../components/OpportunityCard";
import { EmptyState, ErrorState, LoadingState, PrimaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";

export default function AIOpportunitiesPage() {
  const { assessment, cache, loading, errors, fetchOpportunities } = useAssessment();

  useEffect(() => {
    if (assessment.process_id) fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id]);

  if (!assessment.process_id) {
    return (
      <EmptyState
        title="Complete the Business Assessment first"
        description="AI opportunities are derived from your process map, not invented generically."
        action={
          <Link to="/app/assessment">
            <PrimaryButton>Go to Business Assessment</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.opportunities && !cache.opportunities) return <LoadingState label="Identifying AI opportunities…" />;
  if (errors.opportunities) return <ErrorState message={errors.opportunities} onRetry={fetchOpportunities} />;
  if (!cache.opportunities) return <LoadingState label="Identifying AI opportunities…" />;

  const opportunities = [...cache.opportunities].sort((a, b) => b.priority_score - a.priority_score);

  return (
    <div>
      <SectionHeading
        eyebrow="Grounded in your process map"
        title="AI Opportunities"
        description="Every opportunity below is anchored to a real stage in your process — none are generic AI suggestions. Each is scored on Pivotly's transparent priority framework."
        action={
          <Link to="/app/recommendation">
            <PrimaryButton>See Recommendation →</PrimaryButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {opportunities.map((opp, i) => (
          <OpportunityCard key={opp.id} opportunity={opp} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
