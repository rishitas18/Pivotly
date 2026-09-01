import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { Field, NumberInput } from "../components/FormFields";
import { ImpactCharts, SavingsBreakdownChart, type MetricComparison } from "../components/ImpactCharts";
import { KPIGrid } from "../components/KPIGrid";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PrimaryButton, SectionHeading, StatBlock } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";
import type { KPIEntry } from "../types";
import { formatCurrency, formatNumber } from "../utils/format";

export default function BusinessCasePage() {
  const { assessment, updateAssessment, cache, loading, errors, fetchROI } = useAssessment();
  const [kpis, setKpis] = useState<KPIEntry[]>([]);

  useEffect(() => {
    if (assessment.process_id) fetchROI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id]);

  useEffect(() => {
    if (assessment.process_id) api.getKpis(assessment.process_id).then(setKpis);
  }, [assessment.process_id]);

  if (!assessment.process_id) {
    return (
      <EmptyState
        title="Complete the Business Assessment first"
        description="The ROI calculator uses the volume, effort, and cost figures from your assessment as a starting point."
        action={
          <Link to="/app/assessment">
            <PrimaryButton>Go to Business Assessment</PrimaryButton>
          </Link>
        }
      />
    );
  }

  if (loading.roi && !cache.roi) return <LoadingState label="Calculating business case…" />;
  if (errors.roi) return <ErrorState message={errors.roi} onRetry={fetchROI} />;
  if (!cache.roi) return <LoadingState label="Calculating business case…" />;

  const roi = cache.roi;
  const automationFrac = assessment.expected_automation_pct / 100;
  const timeReductionFrac = assessment.expected_time_reduction_pct / 100;
  const efficiencyFactor = 1 - automationFrac * timeReductionFrac;

  const metrics: MetricComparison[] = [
    {
      label: "Processing Time",
      unit: "min",
      before: assessment.current_processing_time_minutes,
      after: assessment.current_processing_time_minutes * efficiencyFactor,
      formatter: (v) => `${v.toFixed(0)} min`,
    },
    {
      label: "Manual Effort",
      unit: "FTE",
      before: assessment.manual_effort_fte,
      after: assessment.manual_effort_fte * efficiencyFactor,
      formatter: (v) => `${v.toFixed(1)} FTE`,
    },
    {
      label: "Error Rate",
      unit: "%",
      before: assessment.error_rate_pct,
      after: assessment.error_rate_pct * (1 - automationFrac),
      formatter: (v) => `${v.toFixed(1)}%`,
    },
    {
      label: "Annual Operating Cost",
      unit: "$",
      before: roi.current_state.current_annual_operating_cost,
      after: roi.current_state.current_annual_operating_cost - roi.savings.productivity_savings,
      formatter: (v) => formatCurrency(v),
    },
  ];

  return (
    <div>
      <SectionHeading
        eyebrow="Directional estimate based on user-provided assumptions"
        title="Business Case / ROI"
        description="Every figure below is calculated with the deterministic formulas in BUSINESS_LOGIC.md — no LLM is involved in this math."
        action={
          <Link to="/app/roadmap">
            <PrimaryButton>View Implementation Roadmap →</PrimaryButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-ink)]">Assumptions</h3>
          <div className="space-y-4">
            <Field label="Annual Transaction Volume">
              <NumberInput
                value={assessment.annual_transaction_volume}
                onChange={(v) => updateAssessment({ annual_transaction_volume: v })}
              />
            </Field>
            <Field label="Current Processing Time" hint="minutes">
              <NumberInput
                value={assessment.current_processing_time_minutes}
                onChange={(v) => updateAssessment({ current_processing_time_minutes: v })}
              />
            </Field>
            <Field label="Average Employee Cost" hint="$/year">
              <NumberInput
                value={assessment.avg_employee_cost}
                onChange={(v) => updateAssessment({ avg_employee_cost: v })}
              />
            </Field>
            <Field label="Error Rate" hint="%">
              <NumberInput value={assessment.error_rate_pct} onChange={(v) => updateAssessment({ error_rate_pct: v })} step={0.1} />
            </Field>
            <Field label="Cost per Error" hint="$">
              <NumberInput value={assessment.cost_per_error} onChange={(v) => updateAssessment({ cost_per_error: v })} />
            </Field>
            <Field label="Expected Automation" hint="% of volume">
              <NumberInput
                value={assessment.expected_automation_pct}
                onChange={(v) => updateAssessment({ expected_automation_pct: v })}
              />
            </Field>
            <Field label="Expected Time Reduction" hint="%">
              <NumberInput
                value={assessment.expected_time_reduction_pct}
                onChange={(v) => updateAssessment({ expected_time_reduction_pct: v })}
              />
            </Field>
            <Field label="Implementation Cost" hint="one-time, $">
              <NumberInput
                value={assessment.implementation_cost}
                onChange={(v) => updateAssessment({ implementation_cost: v })}
              />
            </Field>
            <Field label="Annual Platform Cost" hint="$/year">
              <NumberInput
                value={assessment.annual_platform_cost}
                onChange={(v) => updateAssessment({ annual_platform_cost: v })}
              />
            </Field>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-ink)]">Return Summary</h3>
              <Badge label={roi.disclaimer} tone="Medium" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <StatBlock label="Annual Benefit" value={formatCurrency(roi.savings.annual_benefit)} />
              <StatBlock label="ROI" value={`${roi.returns.roi_pct}%`} />
              <StatBlock
                label="Payback Period"
                value={roi.returns.payback_months !== null ? `${roi.returns.payback_months} mo` : "N/A"}
              />
              <StatBlock label="Year-1 Investment" value={formatCurrency(roi.investment.total_year1_investment)} />
            </div>
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Savings Breakdown
              </p>
              <SavingsBreakdownChart
                productivity={roi.savings.productivity_savings}
                errorReduction={roi.savings.error_reduction_savings}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-[var(--color-muted)] sm:grid-cols-4">
              <p>Hourly rate: {formatCurrency(roi.assumptions.hourly_rate)}</p>
              <p>Automated volume: {formatNumber(roi.assumptions.automated_volume)}</p>
              <p>Hours saved/year: {formatNumber(roi.assumptions.hours_saved_annually)}</p>
              <p>Net annual benefit: {formatCurrency(roi.returns.net_annual_benefit)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-ink)]">Business Impact — Before / After</h3>
            <ImpactCharts metrics={metrics} />
          </Card>
        </div>
      </div>

      {kpis.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-ink)]">KPI Framework</h3>
          <KPIGrid kpis={kpis} />
        </div>
      )}
    </div>
  );
}
