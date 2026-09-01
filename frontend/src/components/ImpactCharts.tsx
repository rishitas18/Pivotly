import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MetricComparison {
  label: string;
  before: number;
  after: number;
  unit: string;
  formatter?: (v: number) => string;
}

function MiniBeforeAfterChart({ metric }: { metric: MetricComparison }) {
  const format = metric.formatter ?? ((v: number) => `${v.toFixed(1)} ${metric.unit}`);
  const data = [
    { name: "Before", value: metric.before },
    { name: "After", value: metric.after },
  ];
  const improved = metric.after < metric.before;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">{metric.label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-bold text-[var(--color-ink)]">{format(metric.before)}</span>
        <span className="text-[var(--color-muted)]">→</span>
        <span className={`text-lg font-bold ${improved ? "text-[var(--color-status-green)]" : "text-[var(--color-ink)]"}`}>
          {format(metric.after)}
        </span>
      </div>
      <div style={{ height: 90 }} className="mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7dfcb" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8c8471" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v: number) => format(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7dfcb" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#d6c9ac" : "#7c86f0"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ImpactCharts({ metrics }: { metrics: MetricComparison[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <MiniBeforeAfterChart key={m.label} metric={m} />
      ))}
    </div>
  );
}

export function SavingsBreakdownChart({
  productivity,
  errorReduction,
}: {
  productivity: number;
  errorReduction: number;
}) {
  const data = [
    { name: "Productivity Savings", value: Math.round(productivity) },
    { name: "Error Reduction Savings", value: Math.round(errorReduction) },
  ];
  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e7dfcb" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#8c8471" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#3a362e" }} width={160} />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e7dfcb" }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#7c86f0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type { MetricComparison };
