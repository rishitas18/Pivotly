import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { api } from "../api/client";
import {
  BLANK_ASSESSMENT,
  type ArchitectureResult,
  type AssessmentInput,
  type ExecutiveSummaryResult,
  type Opportunity,
  type ProcessMap,
  type RecommendationResult,
  type RiskEntry,
  type ROIResult,
  type RoadmapPhase,
  type StakeholderEntry,
} from "../types";

interface DerivedCache {
  processMap?: ProcessMap;
  opportunities?: Opportunity[];
  recommendation?: RecommendationResult;
  architecture?: ArchitectureResult;
  roi?: ROIResult;
  roadmap?: RoadmapPhase[];
  risks?: RiskEntry[];
  stakeholders?: StakeholderEntry[];
  executiveSummary?: ExecutiveSummaryResult;
}

interface StepsCompleted {
  context: boolean;
  problem: boolean;
  readiness: boolean;
}

type LoadingKey = keyof DerivedCache;

interface AssessmentContextValue {
  assessment: AssessmentInput;
  updateAssessment: (patch: Partial<AssessmentInput>) => void;
  resetAssessment: () => void;

  scenarioId: string | null;
  scenarioTitle: string | null;
  loadScenario: (id: string) => Promise<void>;

  stepsCompleted: StepsCompleted;
  markStepComplete: (step: keyof StepsCompleted) => void;

  selectedOpportunityId: string | null;
  selectOpportunity: (id: string) => void;

  cache: DerivedCache;
  loading: Partial<Record<LoadingKey, boolean>>;
  errors: Partial<Record<LoadingKey, string>>;

  fetchProcessMap: () => Promise<ProcessMap | undefined>;
  fetchOpportunities: () => Promise<Opportunity[] | undefined>;
  fetchRecommendation: () => Promise<RecommendationResult | undefined>;
  fetchArchitecture: () => Promise<ArchitectureResult | undefined>;
  fetchROI: () => Promise<ROIResult | undefined>;
  fetchRoadmap: () => Promise<RoadmapPhase[] | undefined>;
  fetchRisks: () => Promise<RiskEntry[] | undefined>;
  fetchStakeholders: () => Promise<StakeholderEntry[] | undefined>;
  fetchExecutiveSummary: () => Promise<ExecutiveSummaryResult | undefined>;

  progressPct: number;
  sectionStatus: Record<string, boolean>;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [assessment, setAssessment] = useState<AssessmentInput>(BLANK_ASSESSMENT);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [scenarioTitle, setScenarioTitle] = useState<string | null>(null);
  const [stepsCompleted, setStepsCompleted] = useState<StepsCompleted>({
    context: false,
    problem: false,
    readiness: false,
  });
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [cache, setCache] = useState<DerivedCache>({});
  const [loading, setLoading] = useState<Partial<Record<LoadingKey, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<LoadingKey, string>>>({});

  const clearDerivedState = useCallback(() => {
    setCache({});
    setErrors({});
    setSelectedOpportunityId(null);
  }, []);

  const updateAssessment = useCallback(
    (patch: Partial<AssessmentInput>) => {
      setAssessment((prev) => ({ ...prev, ...patch }));
      clearDerivedState();
    },
    [clearDerivedState],
  );

  const resetAssessment = useCallback(() => {
    setAssessment(BLANK_ASSESSMENT);
    setScenarioId(null);
    setScenarioTitle(null);
    setStepsCompleted({ context: false, problem: false, readiness: false });
    clearDerivedState();
  }, [clearDerivedState]);

  const loadScenario = useCallback(
    async (id: string) => {
      const scenario = await api.loadScenario(id);
      setAssessment(scenario.assessment);
      setScenarioId(scenario.id);
      setScenarioTitle(scenario.title);
      setStepsCompleted({ context: true, problem: true, readiness: true });
      clearDerivedState();
    },
    [clearDerivedState],
  );

  const markStepComplete = useCallback((step: keyof StepsCompleted) => {
    setStepsCompleted((prev) => ({ ...prev, [step]: true }));
  }, []);

  const selectOpportunity = useCallback((id: string) => {
    setSelectedOpportunityId(id);
    setCache((prev) => ({
      ...prev,
      architecture: undefined,
      roadmap: undefined,
      risks: undefined,
      stakeholders: undefined,
      executiveSummary: undefined,
    }));
  }, []);

  const runFetch = useCallback(
    async <K extends LoadingKey>(key: K, fn: () => Promise<DerivedCache[K]>) => {
      setLoading((prev) => ({ ...prev, [key]: true }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      try {
        const result = await fn();
        setCache((prev) => ({ ...prev, [key]: result }));
        return result;
      } catch (err) {
        setErrors((prev) => ({ ...prev, [key]: err instanceof Error ? err.message : "Something went wrong." }));
        return undefined;
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [],
  );

  const fetchProcessMap = useCallback(async () => {
    if (cache.processMap) return cache.processMap;
    return runFetch("processMap", () => api.analyzeProcess(assessment));
  }, [assessment, cache.processMap, runFetch]);

  const fetchOpportunities = useCallback(async () => {
    if (cache.opportunities) return cache.opportunities;
    return runFetch("opportunities", () => api.getOpportunities(assessment));
  }, [assessment, cache.opportunities, runFetch]);

  const fetchRecommendation = useCallback(async () => {
    if (cache.recommendation) return cache.recommendation;
    const result = await runFetch("recommendation", () => api.getRecommendation(assessment));
    if (result && !selectedOpportunityId) {
      setSelectedOpportunityId(result.recommended.id);
    }
    return result;
  }, [assessment, cache.recommendation, runFetch, selectedOpportunityId]);

  const fetchArchitecture = useCallback(async () => {
    if (cache.architecture) return cache.architecture;
    return runFetch("architecture", () => api.getArchitecture(assessment, selectedOpportunityId ?? undefined));
  }, [assessment, cache.architecture, runFetch, selectedOpportunityId]);

  const fetchROI = useCallback(async () => {
    if (cache.roi) return cache.roi;
    return runFetch("roi", () => api.getBusinessCase(assessment));
  }, [assessment, cache.roi, runFetch]);

  const fetchRoadmap = useCallback(async () => {
    if (cache.roadmap) return cache.roadmap;
    return runFetch("roadmap", () => api.getRoadmap(assessment, selectedOpportunityId ?? undefined));
  }, [assessment, cache.roadmap, runFetch, selectedOpportunityId]);

  const fetchRisks = useCallback(async () => {
    if (cache.risks) return cache.risks;
    return runFetch("risks", () => api.getRisks(assessment, selectedOpportunityId ?? undefined));
  }, [assessment, cache.risks, runFetch, selectedOpportunityId]);

  const fetchStakeholders = useCallback(async () => {
    if (cache.stakeholders) return cache.stakeholders;
    return runFetch("stakeholders", () => api.getStakeholders(assessment, selectedOpportunityId ?? undefined));
  }, [assessment, cache.stakeholders, runFetch, selectedOpportunityId]);

  const fetchExecutiveSummary = useCallback(async () => {
    if (cache.executiveSummary) return cache.executiveSummary;
    return runFetch("executiveSummary", () =>
      api.getExecutiveSummary(assessment, selectedOpportunityId ?? undefined),
    );
  }, [assessment, cache.executiveSummary, runFetch, selectedOpportunityId]);

  const sectionStatus = useMemo(
    () => ({
      businessAssessment: stepsCompleted.context && stepsCompleted.problem && stepsCompleted.readiness,
      processAnalysis: !!cache.processMap,
      aiOpportunities: !!cache.opportunities,
      recommendation: !!cache.recommendation,
      solutionArchitecture: !!cache.architecture,
      businessCase: !!cache.roi,
      implementationRoadmap: !!cache.roadmap,
      riskGovernance: !!cache.risks,
      executiveSummary: !!cache.executiveSummary,
    }),
    [stepsCompleted, cache],
  );

  const progressPct = useMemo(() => {
    const values = Object.values(sectionStatus);
    const done = values.filter(Boolean).length;
    return Math.round((done / values.length) * 100);
  }, [sectionStatus]);

  const value: AssessmentContextValue = {
    assessment,
    updateAssessment,
    resetAssessment,
    scenarioId,
    scenarioTitle,
    loadScenario,
    stepsCompleted,
    markStepComplete,
    selectedOpportunityId,
    selectOpportunity,
    cache,
    loading,
    errors,
    fetchProcessMap,
    fetchOpportunities,
    fetchRecommendation,
    fetchArchitecture,
    fetchROI,
    fetchRoadmap,
    fetchRisks,
    fetchStakeholders,
    fetchExecutiveSummary,
    progressPct,
    sectionStatus,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
