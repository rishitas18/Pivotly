import { Link } from "react-router-dom";
import { DemoScenarioPicker } from "../components/DemoScenarioPicker";
import { Card, SecondaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";

export default function OverviewPage() {
  const { assessment, scenarioTitle, sectionStatus } = useAssessment();
  const hasContext = !!assessment.industry;

  return (
    <div>
      <SectionHeading
        eyebrow="Overview"
        title="Welcome to Pivotly"
        description="Start from a realistic demo scenario, or work through a live assessment from scratch."
      />

      {hasContext && (
        <Card className="mb-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Current Assessment
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-ink)]">
                {scenarioTitle ?? `${assessment.industry} — ${assessment.business_function}`}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-[var(--color-muted)]">{assessment.problem_description}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/app/assessment">
                <SecondaryButton>Edit Assessment</SecondaryButton>
              </Link>
              <Link to={sectionStatus.processAnalysis ? "/app/process" : "/app/assessment"}>
                <SecondaryButton>Continue →</SecondaryButton>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Demo Scenarios</h2>
        <Link to="/app/assessment" className="text-xs font-medium text-[var(--color-accent)] hover:underline">
          Or start a blank assessment →
        </Link>
      </div>
      <DemoScenarioPicker />

      <Card className="mt-10 p-6">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">How Pivotly works</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Every recommendation follows the same journey: business context and problem inputs feed a
          knowledge-base-grounded process map, which produces AI opportunities scored on a transparent
          0–100 framework. The highest-priority opportunity drives a dynamic solution architecture,
          ROI model, implementation roadmap, risk register, and executive summary — all traceable back
          to the numbers you entered.
        </p>
      </Card>
    </div>
  );
}
