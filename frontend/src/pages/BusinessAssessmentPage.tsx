import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { Checkbox, Field, NumberInput, SelectInput, TextArea, TextInput } from "../components/FormFields";
import { Badge, Card, PrimaryButton, SecondaryButton, SectionHeading } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";
import type { Impact, KnowledgeOptions, ProcessSummary } from "../types";

const STEPS = ["Business Context", "Current Business Problem", "Data & Technology Readiness"] as const;
const IMPACT_LEVELS: Impact[] = ["Low", "Medium", "High", "Critical"];
const DATA_QUALITY_LEVELS = ["Low", "Medium", "High"];

export default function BusinessAssessmentPage() {
  const { assessment, updateAssessment, markStepComplete, stepsCompleted } = useAssessment();
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState<KnowledgeOptions | null>(null);
  const [processes, setProcesses] = useState<ProcessSummary[]>([]);
  const [nlText, setNlText] = useState("");
  const [nlResult, setNlResult] = useState<{ process_id: string; confidence: string; rationale: string } | null>(null);
  const [nlLoading, setNlLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getOptions().then(setOptions);
    api.getProcesses().then(setProcesses);
  }, []);

  const selectedProcess = processes.find((p) => p.id === assessment.process_id);

  const runNlParse = async () => {
    if (!nlText.trim()) return;
    setNlLoading(true);
    try {
      const result = await api.parseNaturalLanguage(nlText);
      setNlResult(result);
    } finally {
      setNlLoading(false);
    }
  };

  const applyNlSuggestion = () => {
    if (!nlResult) return;
    updateAssessment({ process_id: nlResult.process_id, problem_description: nlText });
    setNlResult(null);
  };

  const step1Valid = assessment.industry && assessment.company_size && assessment.business_function && assessment.process_id;
  const step2Valid =
    assessment.problem_description.trim().length > 0 &&
    assessment.current_processing_time_minutes > 0 &&
    assessment.annual_transaction_volume > 0 &&
    assessment.avg_employee_cost > 0;
  const step3Valid = assessment.data_quality && assessment.existing_automation.trim().length > 0;

  const goNext = () => {
    if (step === 1) markStepComplete("context");
    if (step === 2) markStepComplete("problem");
    if (step === 3) {
      markStepComplete("readiness");
      navigate("/app/process");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Step-by-Step Assessment"
        title="Business Assessment"
        description="Ground the recommendation in your organization's actual context, problem, and data readiness."
      />

      <div className="mb-8 flex gap-2">
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const done = idx === 1 ? stepsCompleted.context : idx === 2 ? stepsCompleted.problem : stepsCompleted.readiness;
          return (
            <button
              key={label}
              onClick={() => setStep(idx)}
              className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                step === idx
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              <span className="block text-xs opacity-70">Step {idx}{done ? " · Complete" : ""}</span>
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-6">
        {step === 1 && options && (
          <div className="space-y-5">
            <div className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg)] p-4">
              <p className="text-xs font-semibold text-[var(--color-ink)]">
                Optional: describe your problem in your own words
              </p>
              <div className="mt-2 flex gap-2">
                <TextInput
                  value={nlText}
                  onChange={setNlText}
                  placeholder="e.g. We manually match supplier invoices against purchase orders…"
                />
                <SecondaryButton onClick={runNlParse} disabled={nlLoading || !nlText.trim()}>
                  {nlLoading ? "Analyzing…" : "Suggest Process"}
                </SecondaryButton>
              </div>
              {nlResult && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-surface)] p-3 text-xs">
                  <div>
                    <span className="font-medium text-[var(--color-ink)]">
                      Suggested: {processes.find((p) => p.id === nlResult.process_id)?.name ?? nlResult.process_id}
                    </span>{" "}
                    <Badge label={nlResult.confidence} tone={nlResult.confidence === "High" ? "Low" : "Medium"} />
                    <p className="mt-1 text-[var(--color-muted)]">{nlResult.rationale}</p>
                  </div>
                  <SecondaryButton onClick={applyNlSuggestion}>Apply</SecondaryButton>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Industry">
                <SelectInput
                  value={assessment.industry}
                  onChange={(v) => updateAssessment({ industry: v })}
                  options={options.industries}
                />
              </Field>
              <Field label="Company Size">
                <SelectInput
                  value={assessment.company_size}
                  onChange={(v) => updateAssessment({ company_size: v })}
                  options={options.company_sizes}
                />
              </Field>
              <Field label="Business Function">
                <SelectInput
                  value={assessment.business_function}
                  onChange={(v) => updateAssessment({ business_function: v })}
                  options={options.business_functions}
                />
              </Field>
              <Field label="Business Process">
                <SelectInput
                  value={assessment.process_id}
                  onChange={(v) => updateAssessment({ process_id: v })}
                  options={processes.map((p) => ({ value: p.id, label: p.name }))}
                />
              </Field>
            </div>
            {selectedProcess && (
              <p className="text-xs text-[var(--color-muted)]">
                <span className="font-medium text-[var(--color-ink)]">{selectedProcess.name}:</span>{" "}
                {selectedProcess.description}
              </p>
            )}
          </div>
        )}

        {step === 1 && !options && <p className="text-sm text-[var(--color-muted)]">Loading options…</p>}

        {step === 2 && (
          <div className="space-y-5">
            <Field label="Problem Description">
              <TextArea
                value={assessment.problem_description}
                onChange={(v) => updateAssessment({ problem_description: v })}
                placeholder="Describe what's happening today and why it's a problem…"
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Current Processing Time" hint="minutes / transaction">
                <NumberInput
                  value={assessment.current_processing_time_minutes}
                  onChange={(v) => updateAssessment({ current_processing_time_minutes: v })}
                />
              </Field>
              <Field label="Annual Transaction Volume">
                <NumberInput
                  value={assessment.annual_transaction_volume}
                  onChange={(v) => updateAssessment({ annual_transaction_volume: v })}
                />
              </Field>
              <Field label="Manual Effort" hint="FTE">
                <NumberInput
                  value={assessment.manual_effort_fte}
                  onChange={(v) => updateAssessment({ manual_effort_fte: v })}
                />
              </Field>
              <Field label="Error Rate" hint="%">
                <NumberInput
                  value={assessment.error_rate_pct}
                  onChange={(v) => updateAssessment({ error_rate_pct: v })}
                  step={0.1}
                />
              </Field>
              <Field label="Average Employee Cost" hint="fully loaded, $/year">
                <NumberInput
                  value={assessment.avg_employee_cost}
                  onChange={(v) => updateAssessment({ avg_employee_cost: v })}
                />
              </Field>
              <Field label="SLA Impact">
                <TextInput
                  value={assessment.sla_impact}
                  onChange={(v) => updateAssessment({ sla_impact: v })}
                  placeholder="e.g. Frequent breaches"
                />
              </Field>
              <Field label="Customer Impact">
                <SelectInput
                  value={assessment.customer_impact}
                  onChange={(v) => updateAssessment({ customer_impact: v as Impact })}
                  options={IMPACT_LEVELS}
                />
              </Field>
              <Field label="Employee Impact">
                <SelectInput
                  value={assessment.employee_impact}
                  onChange={(v) => updateAssessment({ employee_impact: v as Impact })}
                  options={IMPACT_LEVELS}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && options && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium text-[var(--color-ink)]">Data Availability</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Checkbox
                  label="Structured data available"
                  checked={assessment.structured_data_available}
                  onChange={(v) => updateAssessment({ structured_data_available: v })}
                />
                <Checkbox
                  label="Unstructured documents available"
                  checked={assessment.unstructured_documents_available}
                  onChange={(v) => updateAssessment({ unstructured_documents_available: v })}
                />
                <Checkbox
                  label="Email data available"
                  checked={assessment.email_data_available}
                  onChange={(v) => updateAssessment({ email_data_available: v })}
                />
                <Checkbox
                  label="Historical records available"
                  checked={assessment.historical_records_available}
                  onChange={(v) => updateAssessment({ historical_records_available: v })}
                />
                <Checkbox
                  label="APIs available"
                  checked={assessment.apis_available}
                  onChange={(v) => updateAssessment({ apis_available: v })}
                />
                <Checkbox
                  label="Existing ERP / CRM system"
                  checked={assessment.existing_erp_crm}
                  onChange={(v) => updateAssessment({ existing_erp_crm: v })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Existing Automation">
                <TextInput
                  value={assessment.existing_automation}
                  onChange={(v) => updateAssessment({ existing_automation: v })}
                  placeholder="e.g. Partial RPA, none, basic chatbot…"
                />
              </Field>
              <Field label="Data Quality">
                <SelectInput
                  value={assessment.data_quality}
                  onChange={(v) => updateAssessment({ data_quality: v as typeof assessment.data_quality })}
                  options={DATA_QUALITY_LEVELS}
                />
              </Field>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-[var(--color-ink)]">
                Existing Enterprise Systems <span className="font-normal text-[var(--color-muted)]">(optional)</span>
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {options.enterprise_systems.map((sys) => (
                  <Checkbox
                    key={sys}
                    label={sys}
                    checked={assessment.enterprise_systems.includes(sys)}
                    onChange={(checked) =>
                      updateAssessment({
                        enterprise_systems: checked
                          ? [...assessment.enterprise_systems, sys]
                          : assessment.enterprise_systems.filter((s) => s !== sys),
                      })
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Pivotly's recommendations are vendor-neutral. Selected systems are used only to
                produce an illustrative architecture mapping later.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
          <SecondaryButton onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            Back
          </SecondaryButton>
          <PrimaryButton
            onClick={goNext}
            disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
          >
            {step === 3 ? "Analyze Process →" : "Continue"}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
