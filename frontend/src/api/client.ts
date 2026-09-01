import type {
  ArchitectureResult,
  AssessmentInput,
  DemoScenarioSummary,
  EcosystemMapping,
  ExecutiveSummaryResult,
  KnowledgeOptions,
  KPIEntry,
  Opportunity,
  ProcessMap,
  ProcessSummary,
  RecommendationResult,
  RiskEntry,
  ROIResult,
  RoadmapPhase,
  StakeholderEntry,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const body = await response.text();
    let detail = body;
    try {
      detail = JSON.parse(body).detail ?? body;
    } catch {
      // keep raw body
    }
    throw new ApiError(response.status, typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return response.json() as Promise<T>;
}

const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });

export const api = {
  health: () => request<{ status: string; mock_mode: boolean }>("/api/health"),

  getOptions: () => request<KnowledgeOptions>("/api/knowledge/options"),
  getProcesses: () => request<ProcessSummary[]>("/api/knowledge/processes"),
  getKpis: (processId: string) => request<KPIEntry[]>(`/api/knowledge/kpis/${processId}`),

  listScenarios: () => request<DemoScenarioSummary[]>("/api/scenarios"),
  loadScenario: (id: string) =>
    request<{ id: string; title: string; tagline: string; assessment: AssessmentInput }>(
      `/api/scenarios/${id}`,
    ),

  analyzeProcess: (assessment: AssessmentInput) => post<ProcessMap>("/api/process/analyze", assessment),

  getOpportunities: (assessment: AssessmentInput) => post<Opportunity[]>("/api/opportunities", assessment),

  getRecommendation: (assessment: AssessmentInput) =>
    post<RecommendationResult>("/api/recommendation", assessment),

  getArchitecture: (assessment: AssessmentInput, opportunityId?: string) =>
    post<ArchitectureResult>("/api/architecture", { assessment, opportunity_id: opportunityId ?? null }),

  getEcosystemMapping: (processId: string, ecosystemKey: string) =>
    post<EcosystemMapping>("/api/architecture/ecosystem", {
      process_id: processId,
      ecosystem_key: ecosystemKey,
    }),

  getBusinessCase: (assessment: AssessmentInput) => post<ROIResult>("/api/business-case", assessment),

  getRoadmap: (assessment: AssessmentInput, opportunityId?: string) =>
    post<RoadmapPhase[]>("/api/roadmap", { assessment, opportunity_id: opportunityId ?? null }),

  getRisks: (assessment: AssessmentInput, opportunityId?: string) =>
    post<RiskEntry[]>("/api/risks", { assessment, opportunity_id: opportunityId ?? null }),

  getStakeholders: (assessment: AssessmentInput, opportunityId?: string) =>
    post<StakeholderEntry[]>("/api/risks/stakeholders", {
      assessment,
      opportunity_id: opportunityId ?? null,
    }),

  getExecutiveSummary: (assessment: AssessmentInput, opportunityId?: string) =>
    post<ExecutiveSummaryResult>("/api/executive-summary", {
      assessment,
      opportunity_id: opportunityId ?? null,
    }),

  parseNaturalLanguage: (freeText: string) =>
    post<{ process_id: string; confidence: string; rationale: string }>("/api/nl-parse", {
      free_text: freeText,
    }),
};

export { ApiError };
