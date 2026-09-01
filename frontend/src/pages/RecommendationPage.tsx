import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SecondaryButton, SectionHeading } from "../components/primitives";
import { ScoreBreakdown } from "../components/ScoreBreakdown";
import { useAssessment } from "../state/AssessmentContext";

export default function RecommendationPage() {
  const { assessment, cache, loading, errors, fetchRecommendation, selectedOpportunityId, selectOpportunity } =
    useAssessment();

  useEffect(() => {
    if (assessment.process_id) fetchRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id]);

  if (!assessment.process_id) {
    return (
      <EmptyState
        title="Complete the Business Assessment first"
        description="The recommendation is generated from your scored AI opportunities."
        action={
          <Link to="/app/assessment">
            <PrimaryButton>Go to Business Assessment</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.recommendation && !cache.recommendation) return <LoadingState label="Generating recommendation…" />;
  if (errors.recommendation) return <ErrorState message={errors.recommendation} onRetry={fetchRecommendation} />;
  if (!cache.recommendation) return <LoadingState label="Generating recommendation…" />;

  const { ranked_opportunities, recommended, rationale, rationale_source } = cache.recommendation;
  const activeId = selectedOpportunityId ?? recommended.id;
  const active = ranked_opportunities.find((o) => o.id === activeId) ?? recommended;

  return (
    <div>
      <SectionHeading
        eyebrow="Highest Priority Opportunity"
        title="Recommendation"
        description="Pivotly recommends one opportunity to pursue first, with the reasoning traced back to your inputs."
        action={
          <Link to="/app/architecture">
            <PrimaryButton>Design Solution Architecture →</PrimaryButton>
          </Link>
        }
      />

      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-ink)]">
              {active.id === recommended.id ? "Recommended" : "Selected"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-ink)]">{active.use_case_name}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Stage: {active.stage_name} · {active.ai_capability}</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-accent)] px-4 py-2 text-center text-white">
            <p className="text-2xl font-bold leading-none tabular-nums">{active.priority_score}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wide opacity-80">Priority Score</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          <div className="mb-1.5 flex items-center gap-2">
            <p className="text-xs font-semibold text-[var(--color-ink)]">Why this opportunity</p>
            <Badge label={rationale_source === "llm" ? "AI-generated" : "Rule-based"} tone="neutral" />
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text)]">{rationale}</p>
        </div>

        <div className="mt-5">
          <ScoreBreakdown scoring={active.scoring} />
        </div>
      </Card>

      <h3 className="mb-3 text-sm font-bold text-[var(--color-ink)]">All Ranked Opportunities</h3>
      <div className="space-y-2">
        {ranked_opportunities.map((opp, i) => (
          <div
            key={opp.id}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
              opp.id === activeId
                ? "border-[var(--color-ink)] bg-[var(--color-bg)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-bg)] text-xs font-bold text-[var(--color-muted)]">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{opp.use_case_name}</p>
                <p className="text-xs text-[var(--color-muted)]">{opp.stage_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[var(--color-ink)] tabular-nums">{opp.priority_score}</span>
              {opp.id !== activeId ? (
                <SecondaryButton onClick={() => selectOpportunity(opp.id)}>Select</SecondaryButton>
              ) : (
                <Badge label="Active" tone="Low" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
