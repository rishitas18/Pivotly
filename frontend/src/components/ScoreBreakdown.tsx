import type { Scoring } from "../types";

const FACTOR_LABELS: Record<string, string> = {
  business_impact: "Business Impact",
  ai_suitability: "AI Suitability",
  technical_feasibility: "Technical Feasibility",
  data_readiness: "Data Readiness",
  time_to_value: "Time to Value",
  implementation_complexity: "Implementation Complexity",
  risk: "Risk",
};

export function ScoreBreakdown({ scoring }: { scoring: Scoring }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[var(--color-muted)]">
              <th className="pb-2 pr-4 font-medium">Factor</th>
              <th className="pb-2 pr-4 font-medium">Score</th>
              <th className="pb-2 pr-4 font-medium">Weight</th>
              <th className="pb-2 font-medium">Contribution</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scoring.factors).map(([key, value]) => {
              const weight = scoring.weights[key];
              const contribution = scoring.contributions[key];
              const isPenalty = weight < 0;
              return (
                <tr key={key} className="border-t border-[var(--color-border)]">
                  <td className="py-1.5 pr-4 text-[var(--color-text)]">{FACTOR_LABELS[key] ?? key}</td>
                  <td className="py-1.5 pr-4 font-medium text-[var(--color-ink)]">{value}</td>
                  <td className="py-1.5 pr-4 text-[var(--color-muted)]">
                    {isPenalty ? "−" : "+"}
                    {Math.abs(weight * 100).toFixed(0)}%
                  </td>
                  <td
                    className="py-1.5 font-semibold"
                    style={{ color: isPenalty ? "var(--color-status-red)" : "var(--color-status-green)" }}
                  >
                    {contribution > 0 ? "+" : ""}
                    {contribution}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-bg)] px-3 py-2.5 text-xs text-[var(--color-muted)]">
        <span>
          Raw score {scoring.raw_score} + {scoring.recenter_offset} recenter offset, clamped to 0–100
        </span>
        <span className="text-sm font-bold text-[var(--color-ink)]">
          Priority Score: {scoring.priority_score}/100
        </span>
      </div>
    </div>
  );
}
