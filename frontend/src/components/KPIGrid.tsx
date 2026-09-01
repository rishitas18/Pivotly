import type { KPIEntry } from "../types";
import { Badge, Card } from "./primitives";

export function KPIGrid({ kpis }: { kpis: KPIEntry[] }) {
  const leading = kpis.filter((k) => k.type === "leading");
  const lagging = kpis.filter((k) => k.type === "lagging");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Badge label="Leading Indicators" tone="leading" />
          <span className="text-xs text-[var(--color-muted)]">Track adoption &amp; quality during rollout</span>
        </div>
        <div className="space-y-3">
          {leading.map((kpi) => (
            <Card key={kpi.id} className="p-4">
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {kpi.name} <span className="font-normal text-[var(--color-muted)]">({kpi.unit})</span>
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{kpi.why_it_matters}</p>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Badge label="Lagging Indicators" tone="lagging" />
          <span className="text-xs text-[var(--color-muted)]">Prove the business outcome after the fact</span>
        </div>
        <div className="space-y-3">
          {lagging.map((kpi) => (
            <Card key={kpi.id} className="p-4">
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {kpi.name} <span className="font-normal text-[var(--color-muted)]">({kpi.unit})</span>
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{kpi.why_it_matters}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
