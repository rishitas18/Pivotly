import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";
import type { EcosystemMapping, KnowledgeOptions } from "../types";

export default function SolutionArchitecturePage() {
  const { assessment, cache, loading, errors, fetchArchitecture, selectedOpportunityId } = useAssessment();
  const [options, setOptions] = useState<KnowledgeOptions | null>(null);
  const [ecosystemKey, setEcosystemKey] = useState("");
  const [mapping, setMapping] = useState<EcosystemMapping | null>(null);
  const [mappingLoading, setMappingLoading] = useState(false);

  useEffect(() => {
    if (assessment.process_id && selectedOpportunityId) fetchArchitecture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id, selectedOpportunityId]);

  useEffect(() => {
    api.getOptions().then(setOptions);
  }, []);

  const handleEcosystemSelect = async (key: string) => {
    setEcosystemKey(key);
    if (!key) {
      setMapping(null);
      return;
    }
    setMappingLoading(true);
    try {
      const result = await api.getEcosystemMapping(assessment.process_id, key);
      setMapping(result);
    } finally {
      setMappingLoading(false);
    }
  };

  if (!assessment.process_id || !selectedOpportunityId) {
    return (
      <EmptyState
        title="Select a recommended opportunity first"
        description="Solution architecture is generated dynamically from the opportunity you're pursuing."
        action={
          <Link to="/app/recommendation">
            <PrimaryButton>Go to Recommendation</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.architecture && !cache.architecture) return <LoadingState label="Designing solution architecture…" />;
  if (errors.architecture) return <ErrorState message={errors.architecture} onRetry={fetchArchitecture} />;
  if (!cache.architecture) return <LoadingState label="Designing solution architecture…" />;

  const architecture = cache.architecture;

  return (
    <div>
      <SectionHeading
        eyebrow={architecture.use_case_name}
        title="Solution Architecture"
        description="A six-layer architecture assembled from the AI capability, data requirements, and integration needs of the recommended opportunity."
        action={
          <Link to="/app/business-case">
            <PrimaryButton>Calculate Business Case →</PrimaryButton>
          </Link>
        }
      />

      <ArchitectureDiagram layers={architecture.layers} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Human-in-the-Loop</p>
          <p className="mt-2 text-sm text-[var(--color-text)]">
            {architecture.human_in_the_loop
              ? "This use case routes high-risk or exception cases to a human approver before action is taken."
              : "This use case is low-risk enough to run without a mandatory human approval step, though monitoring still applies."}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Monitoring</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--color-text)]">
            {architecture.monitoring.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Security Considerations</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--color-text)]">
            {architecture.security_considerations.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Enterprise Platform Mapping</h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Pivotly's core architecture is vendor-neutral. Optionally explore how it might map onto a
              specific ecosystem.
            </p>
          </div>
          <select
            value={ecosystemKey}
            onChange={(e) => handleEcosystemSelect(e.target.value)}
            className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
          >
            <option value="">Select an ecosystem…</option>
            {options?.ecosystems.map((eco) => (
              <option key={eco.key} value={eco.key}>
                {eco.label}
              </option>
            ))}
          </select>
        </div>

        {mappingLoading && <p className="mt-4 text-sm text-[var(--color-muted)]">Loading mapping…</p>}

        {mapping && (
          <div className="mt-5">
            <Badge label={mapping.disclaimer} tone="Medium" />
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(mapping.mapping).map(([category, system]) => (
                <div key={category} className="rounded-md border border-[var(--color-border)] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">{category}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{system}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
