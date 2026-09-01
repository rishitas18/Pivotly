"""Pydantic request/response models. AssessmentInput is the single source of
truth for the shape of an assessment — the frontend form, the demo
scenarios, and every downstream engine all conform to this schema.
"""

from typing import Literal

from pydantic import BaseModel, Field

Impact = Literal["Low", "Medium", "High", "Critical"]
DataQuality = Literal["Low", "Medium", "High"]

INDUSTRIES = [
    "Manufacturing", "Retail", "Banking", "Telecommunications", "Healthcare",
    "Energy", "Logistics", "Media", "Technology", "Public Sector",
]
COMPANY_SIZES = [
    "Small (<500 employees)",
    "Mid-Market (500-5,000 employees)",
    "Large Enterprise (5,000-50,000 employees)",
    "Global Enterprise (50,000+ employees)",
]
BUSINESS_FUNCTIONS = [
    "Finance", "Procurement", "Sales", "Customer Service", "Supply Chain",
    "Operations", "HR", "Marketing", "IT",
]
ENTERPRISE_SYSTEM_OPTIONS = [
    "SAP", "Salesforce", "Microsoft", "Oracle", "ServiceNow", "Custom", "Other",
]


class AssessmentInput(BaseModel):
    # Step 1 — Business Context
    industry: str
    company_size: str
    business_function: str
    process_id: str

    # Step 2 — Current Business Problem
    problem_description: str = Field(min_length=1)
    current_processing_time_minutes: float = Field(gt=0)
    annual_transaction_volume: int = Field(gt=0)
    manual_effort_fte: float = Field(ge=0)
    error_rate_pct: float = Field(ge=0, le=100)
    avg_employee_cost: float = Field(gt=0)
    customer_impact: Impact
    employee_impact: Impact
    sla_impact: str

    # Step 3 — Data & Technology Readiness
    structured_data_available: bool
    unstructured_documents_available: bool
    email_data_available: bool
    historical_records_available: bool
    apis_available: bool
    existing_automation: str
    existing_erp_crm: bool
    data_quality: DataQuality
    enterprise_systems: list[str] = Field(default_factory=list)

    # ROI inputs — defaulted so the assessment is usable before the user
    # reaches the Business Case screen; fully editable there.
    cost_per_error: float = Field(default=50, gt=0)
    implementation_cost: float = Field(default=250000, ge=0)
    annual_platform_cost: float = Field(default=75000, ge=0)
    expected_automation_pct: float = Field(default=50, ge=0, le=100)
    expected_time_reduction_pct: float = Field(default=40, ge=0, le=100)


class AssessmentRecord(BaseModel):
    id: int
    name: str
    scenario_id: str | None
    payload: AssessmentInput


class SaveAssessmentRequest(BaseModel):
    name: str = "Untitled Assessment"
    scenario_id: str | None = None
    assessment: AssessmentInput


class EcosystemMappingRequest(BaseModel):
    process_id: str
    ecosystem_key: str


class NaturalLanguageProblemRequest(BaseModel):
    free_text: str = Field(min_length=1)


class AssessmentWithOpportunity(BaseModel):
    assessment: AssessmentInput
    opportunity_id: str | None = None
