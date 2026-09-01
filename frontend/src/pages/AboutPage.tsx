import { Link } from "react-router-dom";
import { ACCENT_PALETTE } from "../components/primitives";

const PRINCIPLES = [
  {
    title: "AI is one component, not the product",
    body: "The product is the transformation workflow. An LLM is used only for narrative reasoning — never for scoring, ranking, or financial math.",
  },
  {
    title: "Every number is grounded",
    body: "Opportunities are anchored to real process stages; scores come from your actual inputs; ROI formulas are disclosed, not hidden behind a black box.",
  },
  {
    title: "Vendor-neutral by default",
    body: "The core recommendation never assumes a specific ERP or CRM. Ecosystem mappings are opt-in and clearly labeled illustrative.",
  },
  {
    title: "Works with zero configuration",
    body: "No API key, no setup beyond installing dependencies, is required to experience the complete product.",
  },
];

const SKILLS = [
  "Product thinking — a guided journey from ambiguous problem to executive recommendation",
  "Business analysis — process decomposition, bottleneck identification, KPI design",
  "AI/ML judgment — knowing where AI genuinely fits, and being explicit about where it doesn't",
  "Solution architecture — layered, dynamic architecture generation grounded in real requirements",
  "Quantitative reasoning — a disclosed, testable ROI and priority-scoring model",
  "Technical execution — a full-stack app with a tested, deterministic business-logic core",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-75">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-ink)] text-sm font-bold text-[var(--color-ink)]">
              P
            </div>
            <span className="text-sm font-bold text-[var(--color-ink)]">Pivotly</span>
          </Link>
          <Link
            to="/app/overview"
            className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Start Assessment
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="animate-fade-in-up mb-4 inline-block rounded-full bg-[var(--color-accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-ink)]">
          About
        </p>
        <h1 className="animate-fade-in-up stagger-1 text-4xl font-bold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Why Pivotly exists.
        </h1>
        <p className="animate-fade-in-up stagger-2 mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
          Most organizations approach AI backwards: "here is a model, what can we do with it?" That
          produces pilots that never scale, because they were never anchored to a measurable business
          problem in the first place. Pivotly starts from the opposite direction.
        </p>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-ink)] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-white">The product</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            Pivotly replaces a multi-week consulting exercise — process discovery, opportunity
            brainstorming, prioritization workshops, architecture whiteboarding, and a business case in
            a slide deck — with a single guided workflow that produces the same artifacts, grounded in
            the same kind of structured thinking, in minutes.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => {
              const color = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
              return (
                <div key={p.title} className="rounded-2xl p-6" style={{ backgroundColor: color.bg, color: color.text }}>
                  <h3 className="text-base font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm opacity-90">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-2xl font-bold text-[var(--color-ink)]">Why I built this</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text)]">
          <p>
            I built Pivotly as a portfolio project to demonstrate something that's hard to show with
            a typical AI demo: the ability to sit at the intersection of AI, product, and business —
            translating an ambiguous business problem into a scored, architected, and quantified
            recommendation, the way a solution advisor or AI product manager actually would.
          </p>
          <p>
            Most AI portfolio projects prove you can call an API. I wanted to prove something more
            specific: that I understand <em>where</em> AI creates real value and where it doesn't, that I
            can reason about ROI and prioritization with disclosed formulas instead of a black box, and
            that I can communicate all of it — architecture, risk, business case — to both a technical
            and a non-technical audience in the same tool.
          </p>
          <p>
            Every score, every dollar figure, and every ranking in this app is deterministic and
            testable. The AI is there — three narrative-reasoning calls, always with a transparent
            fallback — but it was never the point. The workflow is the point.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-accent-ink)]">
            What this project demonstrates
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-text)]">
            {SKILLS.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-[var(--color-accent)]">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border-strong)] p-10 text-center sm:flex-row">
          <p className="text-sm text-[var(--color-muted)]">Want to see it in action?</p>
          <Link
            to="/app/overview"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)] hover:shadow-md"
          >
            Explore the Demo →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-4xl px-6 py-8 text-xs text-[var(--color-muted)]">
          Pivotly is a portfolio demonstration project.
        </div>
      </footer>
    </div>
  );
}
