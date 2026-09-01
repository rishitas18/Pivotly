import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RiskRegisterTable } from "../components/RiskRegisterTable";
import { StakeholderMap } from "../components/StakeholderMap";
import { EmptyState, ErrorState, LoadingState, PrimaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";

export default function RiskGovernancePage() {
  const { assessment, cache, loading, errors, fetchRisks, fetchStakeholders, selectedOpportunityId } =
    useAssessment();

  useEffect(() => {
    if (assessment.process_id && selectedOpportunityId) {
      fetchRisks();
      fetchStakeholders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id, selectedOpportunityId]);

  if (!assessment.process_id || !selectedOpportunityId) {
    return (
      <EmptyState
        title="Select a recommended opportunity first"
        description="Risk severity is adjusted for the selected opportunity's industry and customer sensitivity."
        action={
          <Link to="/app/recommendation">
            <PrimaryButton>Go to Recommendation</PrimaryButton>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Governance"
        title="Risk & AI Governance"
        description="A standard AI risk register, with severity adjusted for your industry, customer sensitivity, and data quality — plus the stakeholders who own the outcome."
        action={
          <Link to="/app/executive-summary">
            <PrimaryButton>Generate Executive Summary →</PrimaryButton>
          </Link>
        }
      />

      <h3 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Risk Register</h3>
      {loading.risks && !cache.risks && <LoadingState label="Assessing risks…" />}
      {errors.risks && <ErrorState message={errors.risks} onRetry={fetchRisks} />}
      {cache.risks && <RiskRegisterTable risks={cache.risks} />}

      <h3 className="mb-3 mt-10 text-sm font-semibold text-[var(--color-ink)]">Stakeholder Map</h3>
      {loading.stakeholders && !cache.stakeholders && <LoadingState label="Mapping stakeholders…" />}
      {errors.stakeholders && <ErrorState message={errors.stakeholders} onRetry={fetchStakeholders} />}
      {cache.stakeholders && <StakeholderMap stakeholders={cache.stakeholders} />}
    </div>
  );
}
