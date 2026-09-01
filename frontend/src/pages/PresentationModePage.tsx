import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/primitives";
import { useAssessment } from "../state/AssessmentContext";
import { formatCurrency, formatNumber } from "../utils/format";

function Slide({ index, total, eyebrow, title, children }: { index: number; total: number; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center px-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        {eyebrow} · Slide {index + 1} of {total}
      </p>
      <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--color-ink)]">{title}</h2>
      <div className="text-base leading-relaxed text-[var(--color-text)]">{children}</div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

export default function PresentationModePage() {
  const {
    assessment,
    cache,
    selectedOpportunityId,
    fetchProcessMap,
    fetchOpportunities,
    fetchRecommendation,
    fetchArchitecture,
    fetchROI,
    fetchRoadmap,
    fetchRisks,
    fetchExecutiveSummary,
  } = useAssessment();
  const [slideIndex, setSlideIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!assessment.process_id) return;
    (async () => {
      await fetchProcessMap();
      await fetchOpportunities();
      await fetchRecommendation();
      await Promise.all([fetchArchitecture(), fetchROI(), fetchRoadmap(), fetchRisks(), fetchExecutiveSummary()]);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.process_id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSlideIndex((i) => Math.min(11, i + 1));
      if (e.key === "ArrowLeft") setSlideIndex((i) => Math.max(0, i - 1));
      if (e.key === "Escape") navigate("/app/executive-summary");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  if (!assessment.process_id) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-ink)] text-white">
        <div className="text-center">
          <p className="text-lg font-medium">No assessment loaded yet</p>
          <button
            onClick={() => navigate("/app/overview")}
            className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            Go to Overview
          </button>
        </div>
      </div>
    );
  }

  if (!ready || !cache.processMap || !cache.recommendation || !cache.architecture || !cache.roi || !cache.roadmap || !cache.risks || !cache.executiveSummary) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <p className="text-sm text-[var(--color-muted)]">Preparing presentation…</p>
      </div>
    );
  }

  const { processMap, recommendation, architecture, roi, roadmap, risks, executiveSummary } = cache;
  const top = recommendation.recommended;
  const summary = executiveSummary.summary;
  void selectedOpportunityId;

  const slides = [
    // 1. Business Challenge
    <Slide index={0} total={12} eyebrow={assessment.industry} title="Business Challenge">
      <p>{assessment.problem_description}</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatTile label="Process" value={processMap.process.name} />
        <StatTile label="Function" value={assessment.business_function} />
        <StatTile label="Company Size" value={assessment.company_size} />
      </div>
    </Slide>,
    // 2. Current State
    <Slide index={1} total={12} eyebrow="Current State" title="Where the process stands today">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Processing Time" value={`${assessment.current_processing_time_minutes} min`} />
        <StatTile label="Annual Volume" value={formatNumber(assessment.annual_transaction_volume)} />
        <StatTile label="Manual Effort" value={`${assessment.manual_effort_fte} FTE`} />
        <StatTile label="Error Rate" value={`${assessment.error_rate_pct}%`} />
      </div>
      <p className="mt-6 text-sm text-[var(--color-muted)]">
        SLA impact: {assessment.sla_impact} · Customer impact: {assessment.customer_impact} · Employee impact: {assessment.employee_impact}
      </p>
    </Slide>,
    // 3. Process Bottlenecks
    <Slide index={2} total={12} eyebrow="Process Analysis" title="Where the process breaks down">
      <div className="space-y-3">
        {processMap.top_bottlenecks.map((b, i) => (
          <div key={b.stage_id} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-sm font-medium text-[var(--color-ink)]">#{i + 1} {b.stage_name}</span>
            <span className="text-lg font-semibold text-[var(--color-accent)]">{b.bottleneck_potential}</span>
          </div>
        ))}
      </div>
    </Slide>,
    // 4. AI Opportunities
    <Slide index={3} total={12} eyebrow="AI Opportunities" title="Opportunities identified and scored">
      <div className="space-y-2">
        {recommendation.ranked_opportunities.slice(0, 4).map((o, i) => (
          <div key={o.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <span className="text-sm text-[var(--color-ink)]">#{i + 1} {o.use_case_name}</span>
            <span className="text-sm font-semibold text-[var(--color-accent)]">{o.priority_score}/100</span>
          </div>
        ))}
      </div>
    </Slide>,
    // 5. Recommended Use Case
    <Slide index={4} total={12} eyebrow="Recommendation" title={top.use_case_name}>
      <p>{recommendation.rationale}</p>
      <div className="mt-4"><Badge label={`Priority Score: ${top.priority_score}/100`} tone="Low" /></div>
    </Slide>,
    // 6. Solution Architecture
    <Slide index={5} total={12} eyebrow="Solution Design" title="Solution Architecture">
      <div className="space-y-2">
        {architecture.layers.map((l) => (
          <div key={l.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">{l.name}</p>
            <p className="text-sm text-[var(--color-text)]">{l.components.join(" · ")}</p>
          </div>
        ))}
      </div>
    </Slide>,
    // 7. Business Impact
    <Slide index={6} total={12} eyebrow="Business Case" title="Expected business impact">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile label="Annual Benefit" value={formatCurrency(roi.savings.annual_benefit)} />
        <StatTile label="Productivity Savings" value={formatCurrency(roi.savings.productivity_savings)} />
        <StatTile label="Error Reduction Savings" value={formatCurrency(roi.savings.error_reduction_savings)} />
      </div>
    </Slide>,
    // 8. ROI
    <Slide index={7} total={12} eyebrow="Business Case" title="Return on Investment">
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="ROI" value={`${roi.returns.roi_pct}%`} />
        <StatTile label="Payback" value={roi.returns.payback_months !== null ? `${roi.returns.payback_months} mo` : "N/A"} />
        <StatTile label="Year-1 Investment" value={formatCurrency(roi.investment.total_year1_investment)} />
      </div>
      <p className="mt-4 text-xs text-[var(--color-muted)]">{roi.disclaimer}</p>
    </Slide>,
    // 9. Implementation Roadmap
    <Slide index={8} total={12} eyebrow="Roadmap" title="Implementation Roadmap">
      <div className="space-y-3">
        {roadmap.map((p) => (
          <div key={p.phase} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--color-ink)]">{p.name} <span className="font-normal text-[var(--color-muted)]">({p.duration})</span></p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{p.objectives[0]}</p>
          </div>
        ))}
      </div>
    </Slide>,
    // 10. Risks
    <Slide index={9} total={12} eyebrow="Governance" title="Key risks and mitigations">
      <div className="space-y-3">
        {risks.slice(0, 4).map((r) => (
          <div key={r.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-ink)]">{r.name}</span>
              <Badge label={r.severity} />
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{r.mitigation}</p>
          </div>
        ))}
      </div>
    </Slide>,
    // 11. Enterprise Architecture
    <Slide index={10} total={12} eyebrow="Illustrative Mapping" title="Fitting into the enterprise landscape">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          {architecture.layers[architecture.layers.length - 1].name}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text)]">
          {architecture.layers[architecture.layers.length - 1].components.join(" · ")}
        </p>
      </div>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        Illustrative architecture mapping — not a live integration. See the Solution Architecture screen
        to explore other ecosystem mappings (SAP, Microsoft, Salesforce, Oracle, Custom).
      </p>
    </Slide>,
    // 12. Next Steps
    <Slide index={11} total={12} eyebrow="Next Steps" title="Recommended next steps">
      <p>{summary.next_steps}</p>
    </Slide>,
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <span className="text-sm font-bold text-[var(--color-ink)]">Pivotly — Presentation Mode</span>
        <button
          onClick={() => navigate("/app/executive-summary")}
          className="rounded-full border border-[var(--color-border-strong)] px-4 py-1.5 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-bg)]"
        >
          Exit Presentation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-16">
        <div key={slideIndex} className="animate-fade-in-up h-full">
          {slides[slideIndex]}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
        <button
          onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
          disabled={slideIndex === 0}
          className="rounded-full border border-[var(--color-border-strong)] px-5 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-bg)] disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="text-xs font-medium text-[var(--color-muted)]">{slideIndex + 1} / 12</span>
        <button
          onClick={() => setSlideIndex((i) => Math.min(11, i + 1))}
          disabled={slideIndex === 11}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)] disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
