import { Link } from "react-router-dom";
import { ACCENT_PALETTE } from "../components/primitives";
import { useCountUp } from "../utils/useAnimatedNumber";
import { formatCurrency } from "../utils/format";

const TRANSFORMATION_AREAS = [
  {
    name: "Finance",
    description: "Invoice processing, reconciliation, and financial close automated with document AI and predictive matching.",
    example: "Invoice Processing, Record-to-Report",
  },
  {
    name: "Customer Operations",
    description: "Ticket triage, knowledge retrieval, and response drafting that cut resolution time without losing control.",
    example: "Customer Service, Claims Processing",
  },
  {
    name: "Supply Chain",
    description: "Demand forecasting and replenishment planning grounded in real transaction and inventory data.",
    example: "Demand Planning, Inventory Management",
  },
  {
    name: "Sales & Marketing",
    description: "Lead scoring, quote generation, and content operations that speed up revenue-facing workflows.",
    example: "Sales Operations, Content Operations",
  },
];

const JOURNEY_STEPS = [
  "Business Problem", "Business Context", "Current Process", "Pain Points", "AI Opportunities",
  "Use Case Prioritization", "Recommended Solution", "Solution Architecture", "Business Case / ROI",
  "Implementation Roadmap", "Risks & Governance", "Executive Presentation",
];

export default function LandingPage() {
  const benefit = useCountUp(1057014);
  const priorityScore = useCountUp(91);
  const roi = useCountUp(186);
  const payback = useCountUp(5.2);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-ink)] text-sm font-bold text-[var(--color-ink)]">
              P
            </div>
            <span className="text-sm font-bold text-[var(--color-ink)]">Pivotly</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-muted)] sm:flex">
            <a href="#areas" className="transition hover:text-[var(--color-ink)]">Transformation Areas</a>
            <a href="#journey" className="transition hover:text-[var(--color-ink)]">How It Works</a>
            <Link to="/about" className="transition hover:text-[var(--color-ink)]">About</Link>
          </nav>
          <Link
            to="/app/overview"
            className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Start Assessment
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-fade-in-up text-center lg:text-left">
            <p className="mb-5 inline-block rounded-full bg-[var(--color-accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-ink)]">
              AI Transformation &amp; Solution Advisor
            </p>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-6xl">
              Turn business problems into AI transformation opportunities.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-muted)] lg:mx-0">
              Pivotly helps organizations identify high-value AI opportunities, design practical
              solutions, quantify business impact, and build transformation roadmaps.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/app/assessment"
                className="w-full rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                Start Assessment
              </Link>
              <Link
                to="/app/overview"
                className="w-full rounded-full border-2 border-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-ink)] hover:text-white sm:w-auto"
              >
                Explore Demo
              </Link>
            </div>
          </div>

          <div className="animate-fade-in-up stagger-2 mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-ink)] text-white shadow-xl">
            <div className="bg-[var(--color-accent)] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Projected Annual Benefit</p>
              <p className="mt-1 text-4xl font-bold tabular-nums">{formatCurrency(benefit)}</p>
              <p className="mt-1 text-sm text-white/80">Manufacturing — Procure-to-Pay demo scenario</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-white/10 p-5 text-center">
              <div>
                <p className="text-lg font-bold tabular-nums">{Math.round(priorityScore)}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">Priority Score</p>
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">{Math.round(roi)}%</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">ROI</p>
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">{payback.toFixed(1)}mo</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">Payback</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="areas" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">
            AI should start with a business problem — not a technology.
          </h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Pivotly works across every major business function. Four common starting points:
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSFORMATION_AREAS.map((area, i) => {
            const color = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
            return (
              <div
                key={area.name}
                className={`animate-fade-in-up stagger-${i + 1} flex flex-col justify-between rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1`}
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                <div>
                  <h3 className="text-lg font-bold">{area.name}</h3>
                  <p className="mt-2 text-sm opacity-90">{area.description}</p>
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wide opacity-75">{area.example}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="journey" className="border-y border-[var(--color-border)] bg-[var(--color-ink)]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">One coherent transformation journey</h2>
            <p className="mt-3 text-sm text-white/60">
              From a stated business problem to an executive-ready recommendation, every step is
              grounded in your actual inputs.
            </p>
          </div>
          <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            {JOURNEY_STEPS.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: ACCENT_PALETTE[i % ACCENT_PALETTE.length].bg }}
                >
                  {i + 1}
                </span>
                <span className="pt-1 text-sm text-white/90">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Pivotly is a portfolio demonstration project. Vendor and platform references are
            illustrative architecture mappings, not live integrations.
          </span>
          <Link to="/about" className="font-medium text-[var(--color-ink)] transition hover:text-[var(--color-accent-ink)]">
            About this project →
          </Link>
        </div>
      </footer>
    </div>
  );
}
