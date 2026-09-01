import type { ReactNode } from "react";
import { useAnimatedNumber } from "../utils/useAnimatedNumber";

/** The four accent blocks pulled from the reference palette — used to give
 * numbered/sequential cards (roadmap phases, top opportunities) distinct
 * identity instead of one repeated color. */
export const ACCENT_PALETTE = [
  { bg: "#1f4d3a", text: "#ffffff", soft: "#e7f1eb" }, // forest green
  { bg: "#7c86f0", text: "#ffffff", soft: "#ececfc" }, // periwinkle blue
  { bg: "#bd5b21", text: "#ffffff", soft: "#fbeee3" }, // rust orange
  { bg: "#5c1f2e", text: "#ffffff", soft: "#f5e9eb" }, // maroon
];

export function Card({
  children,
  className = "",
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 ${
        hoverable ? "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-ink)] mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">{title}</h1>
        {description && <p className="mt-2 text-sm text-[var(--color-muted)] max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  neutral: "bg-[var(--color-bg)] text-[var(--color-text)] ring-1 ring-inset ring-[var(--color-border-strong)]",
  Low: "bg-[var(--color-status-green-soft)] text-[var(--color-status-green)]",
  Medium: "bg-[var(--color-status-amber-soft)] text-[var(--color-status-amber)]",
  High: "bg-[var(--color-status-red-soft)] text-[var(--color-status-red)]",
  Critical: "bg-[var(--color-status-red-soft)] text-[var(--color-status-red)] ring-1 ring-inset ring-[var(--color-status-red)]/30",
  "On Track": "bg-[var(--color-status-green-soft)] text-[var(--color-status-green)]",
  "At Risk": "bg-[var(--color-status-amber-soft)] text-[var(--color-status-amber)]",
  Delayed: "bg-[var(--color-status-red-soft)] text-[var(--color-status-red)]",
  leading: "bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]",
  lagging: "bg-[var(--color-bg)] text-[var(--color-text)] ring-1 ring-inset ring-[var(--color-border-strong)]",
};

export function Badge({ label, tone }: { label: string; tone?: string }) {
  const cls = badgeTones[tone ?? label] ?? badgeTones.neutral;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{label}</span>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full rounded-full bg-[var(--color-border)] ${className}`}>
      <div
        className="h-2 rounded-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function ScoreBar({ label, value, tone = "accent" }: { label: string; value: number; tone?: "accent" | "danger" }) {
  const color = tone === "danger" ? "bg-[var(--color-status-red)]" : "bg-[var(--color-accent)]";
  const animated = useAnimatedNumber(value);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>{label}</span>
        <span className="font-semibold text-[var(--color-ink)] tabular-nums">{Math.round(animated)}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--color-border)]">
        <div className={`h-1.5 rounded-full transition-all duration-500 ease-out ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/60 p-8 text-sm text-[var(--color-muted)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-accent)]" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-[var(--color-status-red)]/25 bg-[var(--color-status-red-soft)] p-6 text-sm">
      <p className="font-semibold text-[var(--color-status-red)]">Something went wrong</p>
      <p className="mt-1 text-[var(--color-text)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-full border border-[var(--color-status-red)]/30 bg-transparent px-4 py-1.5 text-xs font-semibold text-[var(--color-status-red)] transition hover:bg-[var(--color-status-red)]/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/50 p-10 text-center">
      <p className="text-sm font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-[var(--color-muted)]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-bg)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

export function StatBlock({
  label,
  value,
  sublabel,
  numericValue,
  formatter,
}: {
  label: string;
  value: string;
  sublabel?: string;
  numericValue?: number;
  formatter?: (n: number) => string;
}) {
  const animated = useAnimatedNumber(numericValue ?? 0);
  const display = numericValue !== undefined && formatter ? formatter(animated) : value;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--color-ink)] tabular-nums">{display}</p>
      {sublabel && <p className="mt-0.5 text-xs text-[var(--color-muted)]">{sublabel}</p>}
    </div>
  );
}

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}
