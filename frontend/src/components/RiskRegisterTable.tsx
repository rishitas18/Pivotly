import type { RiskEntry } from "../types";
import { Badge } from "./primitives";

export function RiskRegisterTable({ risks }: { risks: RiskEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[var(--color-bg)] text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          <tr>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Likelihood</th>
            <th className="px-4 py-3">Mitigation</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk) => (
            <tr key={risk.id} className="border-t border-[var(--color-border)] align-top transition-colors hover:bg-[var(--color-surface-hover)]">
              <td className="px-4 py-3">
                <p className="font-semibold text-[var(--color-ink)]">{risk.name}</p>
                <p className="mt-0.5 max-w-xs text-xs text-[var(--color-muted)]">{risk.description}</p>
              </td>
              <td className="px-4 py-3">
                <Badge label={risk.severity} />
              </td>
              <td className="px-4 py-3">
                <Badge label={risk.likelihood} />
              </td>
              <td className="px-4 py-3 max-w-sm text-xs text-[var(--color-text)]">{risk.mitigation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
