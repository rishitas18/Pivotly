import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ACCENT_PALETTE, Badge, Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";

export default function ImplementationRoadmapPage() {
  const { assessment, cache, loading, errors, fetchRoadmap, selectedOpportunityId } = useAssessment();

  useEffect(() => {
    if (assessment.process_id && selectedOpportunityId) fetchRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id, selectedOpportunityId]);

  if (!assessment.process_id || !selectedOpportunityId) {
    return (
      <EmptyState
        title="Select a recommended opportunity first"
        description="The roadmap's duration and activities are derived from the selected opportunity's complexity."
        action={
          <Link to="/app/recommendation">
            <PrimaryButton>Go to Recommendation</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.roadmap && !cache.roadmap) return <LoadingState label="Building implementation roadmap…" />;
  if (errors.roadmap) return <ErrorState message={errors.roadmap} onRetry={fetchRoadmap} />;
  if (!cache.roadmap) return <LoadingState label="Building implementation roadmap…" />;

  return (
    <div>
      <SectionHeading
        eyebrow="Sequenced by opportunity complexity"
        title="Implementation Roadmap"
        description="A three-phase path from pilot to enterprise rollout, sized to the complexity of the recommended opportunity."
        action={
          <Link to="/app/risk-governance">
            <PrimaryButton>View Risk & Governance →</PrimaryButton>
          </Link>
        }
      />

      <div className="space-y-6">
        {cache.roadmap.map((phase, i) => {
          const color = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
          return (
          <Card key={phase.phase} className="overflow-hidden p-0">
            <div className="h-1.5" style={{ backgroundColor: color.bg }} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-6 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: color.bg }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{phase.phase}</p>
                  <h3 className="text-base font-bold text-[var(--color-ink)]">{phase.name}</h3>
                </div>
              </div>
              <Badge label={phase.duration} tone="neutral" />
            </div>
            <div className="p-6 pt-4">

            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Objectives</p>
                <ul className="space-y-1 text-sm text-[var(--color-text)]">
                  {phase.objectives.map((o) => (
                    <li key={o}>• {o}</li>
                  ))}
                </ul>
                <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Activities</p>
                <ul className="space-y-1 text-sm text-[var(--color-text)]">
                  {phase.activities.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Technology</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {phase.technology.map((t) => (
                    <span key={t} className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-xs text-[var(--color-text)]">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Stakeholders</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {phase.stakeholders.map((s) => (
                    <span key={s} className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-xs text-[var(--color-text)]">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">KPIs</p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.kpis.map((k) => (
                    <Badge key={k} label={k} tone="leading" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[var(--color-bg)] p-3">
              <p className="text-xs font-semibold text-[var(--color-ink)]">Success Criteria</p>
              <p className="mt-0.5 text-sm text-[var(--color-text)]">{phase.success_criteria}</p>
            </div>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
