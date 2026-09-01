import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAssessment } from "../state/AssessmentContext";
import type { DemoScenarioSummary } from "../types";
import { Card, ErrorState, LoadingState, PrimaryButton } from "./primitives";

export function DemoScenarioPicker({ onLoaded }: { onLoaded?: () => void }) {
  const [scenarios, setScenarios] = useState<DemoScenarioSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { loadScenario } = useAssessment();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .listScenarios()
      .then((data) => {
        setScenarios(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    try {
      await loadScenario(id);
      onLoaded?.();
      navigate("/app/process");
    } finally {
      setLoadingId(null);
    }
  };

  if (status === "loading") return <LoadingState label="Loading demo scenarios…" />;
  if (status === "error") return <ErrorState message="Could not load demo scenarios from the API." />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {scenarios.map((s) => (
        <Card key={s.id} className="flex flex-col justify-between p-5">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">{s.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">{s.tagline}</p>
          </div>
          <PrimaryButton
            className="mt-4 w-full"
            onClick={() => handleLoad(s.id)}
            disabled={loadingId === s.id}
          >
            {loadingId === s.id ? "Loading…" : "Load Demo"}
          </PrimaryButton>
        </Card>
      ))}
    </div>
  );
}
