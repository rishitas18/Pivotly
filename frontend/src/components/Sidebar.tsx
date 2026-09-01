import { Link, NavLink } from "react-router-dom";
import { useAssessment } from "../state/AssessmentContext";
import { ProgressBar } from "./primitives";

const NAV_ITEMS = [
  { to: "/app/overview", label: "Overview", section: null },
  { to: "/app/assessment", label: "Business Assessment", section: "businessAssessment" },
  { to: "/app/process", label: "Process Analysis", section: "processAnalysis" },
  { to: "/app/opportunities", label: "AI Opportunities", section: "aiOpportunities" },
  { to: "/app/recommendation", label: "Recommendation", section: "recommendation" },
  { to: "/app/architecture", label: "Solution Architecture", section: "solutionArchitecture" },
  { to: "/app/business-case", label: "Business Case", section: "businessCase" },
  { to: "/app/roadmap", label: "Implementation Roadmap", section: "implementationRoadmap" },
  { to: "/app/risk-governance", label: "Risk & Governance", section: "riskGovernance" },
  { to: "/app/executive-summary", label: "Executive Summary", section: "executiveSummary" },
] as const;

export function Sidebar() {
  const { progressPct, sectionStatus, scenarioTitle } = useAssessment();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5 transition hover:opacity-75" title="Back to home">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-ink)] text-sm font-bold text-[var(--color-ink)]">
          P
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-ink)]">Pivotly</p>
          <p className="text-[11px] text-[var(--color-muted)]">Solution Advisor</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const done = item.section ? sectionStatus[item.section] : false;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-ink)] text-white"
                    : "text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {item.section && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        done ? "bg-[var(--color-status-green)]" : isActive ? "bg-white/50" : "bg-[var(--color-border-strong)]"
                      }`}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <NavLink
          to="/app/presentation"
          className="mt-2 flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-all duration-200 hover:bg-[var(--color-bg)]"
        >
          Presentation Mode
        </NavLink>
      </nav>

      <div className="border-t border-[var(--color-border)] px-5 py-4">
        {scenarioTitle && (
          <p className="mb-2 truncate text-[11px] text-[var(--color-muted)]" title={scenarioTitle}>
            Scenario: {scenarioTitle}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
          <span>Assessment Progress</span>
          <span className="font-semibold text-[var(--color-ink)]">{progressPct}%</span>
        </div>
        <ProgressBar value={progressPct} className="mt-2" />
        <Link
          to="/about"
          className="mt-4 block text-center text-[11px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-accent-ink)]"
        >
          About Pivotly
        </Link>
      </div>
    </aside>
  );
}
