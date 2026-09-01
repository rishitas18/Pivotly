import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProcessFlowDiagram } from "../components/ProcessFlowDiagram";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PrimaryButton, ScoreBar, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";

export default function ProcessAnalysisPage() {
  const { assessment, cache, loading, errors, fetchProcessMap } = useAssessment();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  useEffect(() => {
    if (assessment.process_id) fetchProcessMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id]);

  if (!assessment.process_id) {
    return (
      <EmptyState
        title="Complete the Business Assessment first"
        description="Pivotly builds the process map from your business context and problem inputs."
        action={
          <Link to="/app/assessment">
            <PrimaryButton>Go to Business Assessment</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.processMap && !cache.processMap) return <LoadingState label="Analyzing process…" />;
  if (errors.processMap) return <ErrorState message={errors.processMap} onRetry={fetchProcessMap} />;
  if (!cache.processMap) return <LoadingState label="Analyzing process…" />;

  const { process, stages, top_bottlenecks } = cache.processMap;
  const selectedStage = stages.find((s) => s.id === selectedStageId) ?? stages.find((s) => s.id === top_bottlenecks[0]?.stage_id) ?? stages[0];

  return (
    <div>
      <SectionHeading
        eyebrow={process.category}
        title={`Process Analysis — ${process.name}`}
        description={process.description}
        action={
          <Link to="/app/opportunities">
            <PrimaryButton>View AI Opportunities →</PrimaryButton>
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {top_bottlenecks.map((b, i) => (
          <Card key={b.stage_id} className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              #{i + 1} Bottleneck
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{b.stage_name}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-accent)]">{b.bottleneck_potential}</p>
          </Card>
        ))}
      </div>

      <p className="mb-3 text-xs font-medium text-[var(--color-muted)]">Click a stage to see its detail below.</p>
      <ProcessFlowDiagram stages={stages} selectedStageId={selectedStage?.id ?? null} onSelectStage={setSelectedStageId} />

      {selectedStage && (
        <Card className="mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-ink)]">{selectedStage.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-[var(--color-muted)]">{selectedStage.description}</p>
            </div>
            <Badge label={`${selectedStage.manual_effort} manual effort`} tone={selectedStage.manual_effort} />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Data Involved</p>
            <div className="flex flex-wrap gap-2">
              {selectedStage.data_involved.map((d) => (
                <span key={d} className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-xs text-[var(--color-text)]">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreBar label="Bottleneck Potential" value={selectedStage.bottleneck_potential} tone="danger" />
            <ScoreBar label="Automation Potential" value={selectedStage.automation_potential} />
            <ScoreBar label="AI Suitability" value={selectedStage.ai_suitability} />
            <ScoreBar label="Business Impact" value={selectedStage.business_impact} />
          </div>
        </Card>
      )}
    </div>
  );
}
