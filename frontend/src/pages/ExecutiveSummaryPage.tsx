import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";
import type { ExecutiveSummary } from "../types";

const SECTIONS: { key: keyof ExecutiveSummary; label: string }[] = [
  { key: "business_challenge", label: "Business Challenge" },
  { key: "current_state", label: "Current State" },
  { key: "recommended_transformation", label: "Recommended Transformation" },
  { key: "why_this_use_case", label: "Why This Use Case" },
  { key: "expected_business_impact", label: "Expected Business Impact" },
  { key: "investment", label: "Investment" },
  { key: "implementation_approach", label: "Implementation Approach" },
  { key: "key_risks", label: "Key Risks" },
  { key: "success_metrics", label: "Success Metrics" },
  { key: "next_steps", label: "Next Steps" },
];

export default function ExecutiveSummaryPage() {
  const { assessment, cache, loading, errors, fetchExecutiveSummary, selectedOpportunityId } = useAssessment();

  useEffect(() => {
    if (assessment.process_id && selectedOpportunityId) fetchExecutiveSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id, selectedOpportunityId]);

  if (!assessment.process_id || !selectedOpportunityId) {
    return (
      <EmptyState
        title="Select a recommended opportunity first"
        description="The executive summary synthesizes the process, opportunity, ROI, roadmap, and risk data you've already generated."
        action={
          <Link to="/app/recommendation">
            <PrimaryButton>Go to Recommendation</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.executiveSummary && !cache.executiveSummary) return <LoadingState label="Drafting executive summary…" />;
  if (errors.executiveSummary) return <ErrorState message={errors.executiveSummary} onRetry={fetchExecutiveSummary} />;
  if (!cache.executiveSummary) return <LoadingState label="Drafting executive summary…" />;

  const { summary } = cache.executiveSummary;

  return (
    <div>
      <SectionHeading
        eyebrow="Ready for a CXO audience"
        title="Executive Summary"
        description="A concise, ten-section summary synthesized from every screen you've completed."
        action={
          <Link to="/app/presentation">
            <PrimaryButton>Enter Presentation Mode →</PrimaryButton>
          </Link>
        }
      />

      <div className="mb-4">
        <Badge label={summary.source === "llm" ? "AI-generated narrative" : "Rule-based narrative"} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map(({ key, label }) => (
          <Card key={key} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">{label}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">{summary[key] as string}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
