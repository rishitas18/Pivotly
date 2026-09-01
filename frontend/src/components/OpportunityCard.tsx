import { useState } from "react";
import { Badge, Card } from "./primitives";
import { ScoreBreakdown } from "./ScoreBreakdown";
import type { Opportunity } from "../types";
import { useAnimatedNumber } from "../utils/useAnimatedNumber";

function scoreTone(score: number) {
  if (score >= 70) return { bg: "var(--color-status-green-soft)", text: "var(--color-status-green)" };
  if (score >= 45) return { bg: "var(--color-status-amber-soft)", text: "var(--color-status-amber)" };
  return { bg: "var(--color-status-red-soft)", text: "var(--color-status-red)" };
}

export function OpportunityCard({
  opportunity,
  rank,
  defaultExpanded = false,
}: {
  opportunity: Opportunity;
  rank?: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tone = scoreTone(opportunity.priority_score);
  const animatedScore = useAnimatedNumber(opportunity.priority_score);

  return (
    <Card hoverable className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg)] text-[10px] font-semibold text-[var(--color-muted)]">
                {rank}
              </span>
            )}
            <h3 className="truncate text-sm font-bold text-[var(--color-ink)]">{opportunity.use_case_name}</h3>
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Stage: {opportunity.stage_name}</p>
        </div>
        <div
          className="shrink-0 rounded-xl px-3 py-1.5 text-center"
          style={{ backgroundColor: tone.bg, color: tone.text }}
        >
          <p className="text-lg font-bold leading-none tabular-nums">{Math.round(animatedScore)}</p>
          <p className="text-[9px] font-semibold uppercase tracking-wide">Priority</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-[var(--color-text)]">{opportunity.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge label={opportunity.ai_capability} tone="neutral" />
        {opportunity.required_data.slice(0, 3).map((d) => (
          <span key={d} className="rounded-full bg-[var(--color-bg)] px-2.5 py-0.5 text-[10px] text-[var(--color-muted)]">
            {d}
          </span>
        ))}
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-4 text-xs font-semibold text-[var(--color-accent-ink)] hover:underline"
      >
        {expanded ? "Hide score breakdown ▲" : "Show score breakdown ▼"}
      </button>

      {expanded && (
        <div className="mt-3 animate-fade-in border-t border-[var(--color-border)] pt-3">
          <ScoreBreakdown scoring={opportunity.scoring} />
        </div>
      )}
    </Card>
  );
}
