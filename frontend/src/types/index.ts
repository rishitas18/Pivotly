// Mirrors backend/app/schemas.py and the engine return shapes. Kept as one
// file since the whole app shares a single assessment + derived-data model.

export type Impact = "Low" | "Medium" | "High" | "Critical";
export type DataQuality = "Low" | "Medium" | "High";

export interface AssessmentInput {
  industry: string;
  company_size: string;
  business_function: string;
  process_id: string;

  problem_description: string;
  current_processing_time_minutes: number;
  annual_transaction_volume: number;
  manual_effort_fte: number;
  error_rate_pct: number;
  avg_employee_cost: number;
  customer_impact: Impact;
  employee_impact: Impact;
  sla_impact: string;

  structured_data_available: boolean;
  unstructured_documents_available: boolean;
  email_data_available: boolean;
  historical_records_available: boolean;
  apis_available: boolean;
  existing_automation: string;
  existing_erp_crm: boolean;
  data_quality: DataQuality;
  enterprise_systems: string[];

  cost_per_error: number;
  implementation_cost: number;
  annual_platform_cost: number;
  expected_automation_pct: number;
  expected_time_reduction_pct: number;
}

export const BLANK_ASSESSMENT: AssessmentInput = {
  industry: "",
  company_size: "",
  business_function: "",
  process_id: "",
  problem_description: "",
  current_processing_time_minutes: 0,
  annual_transaction_volume: 0,
  manual_effort_fte: 0,
  error_rate_pct: 0,
  avg_employee_cost: 0,
  customer_impact: "Medium",
  employee_impact: "Medium",
  sla_impact: "",
  structured_data_available: false,
  unstructured_documents_available: false,
  email_data_available: false,
  historical_records_available: false,
  apis_available: false,
  existing_automation: "",
  existing_erp_crm: false,
  data_quality: "Medium",
  enterprise_systems: [],
  cost_per_error: 50,
  implementation_cost: 250000,
  annual_platform_cost: 75000,
  expected_automation_pct: 50,
  expected_time_reduction_pct: 40,
};

export interface KnowledgeOptions {
  industries: string[];
  company_sizes: string[];
  business_functions: string[];
  enterprise_systems: string[];
  ecosystems: { key: string; label: string }[];
}

export interface ProcessSummary {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface ProcessStage {
  id: string;
  name: string;
  description: string;
  manual_effort: "Low" | "Medium" | "High";
  data_involved: string[];
  bottleneck_potential: number;
  automation_potential: number;
  ai_suitability: number;
  business_impact: number;
  baseline: {
    business_impact: number;
    bottleneck_potential: number;
    ai_suitability: number;
    automation_potential: number;
  };
}

export interface ProcessMap {
  process: { id: string; name: string; category: string; description: string };
  stages: ProcessStage[];
  top_bottlenecks: { stage_id: string; stage_name: string; bottleneck_potential: number }[];
}

export interface OpportunityFactors {
  business_impact: number;
  ai_suitability: number;
  technical_feasibility: number;
  data_readiness: number;
  time_to_value: number;
  implementation_complexity: number;
  risk: number;
}

export interface Scoring {
  factors: OpportunityFactors;
  weights: Record<string, number>;
  contributions: Record<string, number>;
  raw_score: number;
  recenter_offset: number;
  priority_score: number;
}

export interface Opportunity {
  id: string;
  stage_id: string;
  stage_name: string;
  use_case_name: string;
  business_problem: string;
  ai_capability: string;
  required_data: string[];
  description: string;
  factors: OpportunityFactors;
  scoring: Scoring;
  priority_score: number;
}

export interface RecommendationResult {
  ranked_opportunities: Opportunity[];
  recommended: Opportunity;
  rationale: string;
  rationale_source: "llm" | "mock";
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  components: string[];
}

export interface ArchitectureResult {
  use_case_name: string;
  layers: ArchitectureLayer[];
  human_in_the_loop: boolean;
  monitoring: string[];
  security_considerations: string[];
}

export interface EcosystemMapping {
  ecosystem: string;
  label: string;
  disclaimer: string;
  mapping: Record<string, string>;
}

export interface ROIResult {
  assumptions: {
    hourly_rate: number;
    manual_hours_per_transaction: number;
    automated_volume: number;
    hours_saved_annually: number;
  };
  current_state: { current_annual_operating_cost: number };
  savings: {
    productivity_savings: number;
    error_reduction_savings: number;
    annual_benefit: number;
  };
  investment: {
    implementation_cost: number;
    annual_platform_cost: number;
    total_year1_investment: number;
  };
  returns: {
    net_annual_benefit: number;
    roi_pct: number;
    payback_months: number | null;
  };
  disclaimer: string;
}

export interface RoadmapPhase {
  phase: string;
  name: string;
  duration: string;
  objectives: string[];
  activities: string[];
  technology: string[];
  stakeholders: string[];
  kpis: string[];
  risks: string[];
  success_criteria: string;
}

export interface RiskEntry {
  id: string;
  name: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  likelihood: "Low" | "Medium" | "High";
  description: string;
  mitigation: string;
}

export interface StakeholderEntry {
  role: string;
  who: string;
  concern: string;
  expected_value: string;
  decision_responsibility: string;
}

export interface KPIEntry {
  id: string;
  name: string;
  type: "leading" | "lagging";
  unit: string;
  description: string;
  why_it_matters: string;
}

export interface ExecutiveSummary {
  business_challenge: string;
  current_state: string;
  recommended_transformation: string;
  why_this_use_case: string;
  expected_business_impact: string;
  investment: string;
  implementation_approach: string;
  key_risks: string;
  success_metrics: string;
  next_steps: string;
  source: "llm" | "mock";
}

export interface ExecutiveSummaryResult {
  summary: ExecutiveSummary;
  supporting_data: {
    opportunity: Opportunity;
    roi: ROIResult;
    roadmap: RoadmapPhase[];
    top_risks: RiskEntry[];
  };
}

export interface DemoScenarioSummary {
  id: string;
  title: string;
  tagline: string;
}
