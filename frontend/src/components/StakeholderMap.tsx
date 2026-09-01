import type { StakeholderEntry } from "../types";
import { Card } from "./primitives";

export function StakeholderMap({ stakeholders }: { stakeholders: StakeholderEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stakeholders.map((s) => (
        <Card key={s.role} className="p-4">
          <p className="text-sm font-semibold text-[var(--color-ink)]">{s.role}</p>
          <p className="text-xs text-[var(--color-muted)]">{s.who}</p>
          <dl className="mt-3 space-y-2 text-xs">
            <div>
              <dt className="font-medium text-[var(--color-ink)]">Concern</dt>
              <dd className="text-[var(--color-text)]">{s.concern}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">Expected Value</dt>
              <dd className="text-[var(--color-text)]">{s.expected_value}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">Decision Responsibility</dt>
              <dd className="text-[var(--color-text)]">{s.decision_responsibility}</dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>
  );
}
