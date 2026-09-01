"""LLM reasoning layer — the only place in the backend where an LLM call
happens. Every function here has a deterministic, knowledge-base-grounded
fallback so the product works fully with zero API key. When a live call
succeeds, the prompt still forces grounding by injecting the same computed
numbers the fallback uses — the LLM is asked to narrate real numbers, not
invent them.
"""

from app.ai.llm_client import call_llm_structured
from app.knowledge_base.processes import PROCESSES

RATIONALE_SCHEMA = {
    "type": "object",
    "properties": {"rationale": {"type": "string"}},
    "required": ["rationale"],
}

EXEC_SUMMARY_SCHEMA = {
    "type": "object",
    "properties": {
        "business_challenge": {"type": "string"},
        "current_state": {"type": "string"},
        "recommended_transformation": {"type": "string"},
        "why_this_use_case": {"type": "string"},
        "expected_business_impact": {"type": "string"},
        "investment": {"type": "string"},
        "implementation_approach": {"type": "string"},
        "key_risks": {"type": "string"},
        "success_metrics": {"type": "string"},
        "next_steps": {"type": "string"},
    },
    "required": [
        "business_challenge", "current_state", "recommended_transformation", "why_this_use_case",
        "expected_business_impact", "investment", "implementation_approach", "key_risks",
        "success_metrics", "next_steps",
    ],
}

NL_PARSE_SCHEMA = {
    "type": "object",
    "properties": {
        "process_id": {"type": "string"},
        "confidence": {"type": "string", "enum": ["Low", "Medium", "High"]},
        "rationale": {"type": "string"},
    },
    "required": ["process_id", "confidence", "rationale"],
}


# ---------------------------------------------------------------- rationale

def generate_recommendation_rationale(ranked_opportunities: list[dict], assessment: dict, process_name: str) -> dict:
    top = ranked_opportunities[0]
    runner_up = ranked_opportunities[1] if len(ranked_opportunities) > 1 else None

    system_prompt = (
        "You are a solution advisor explaining an AI opportunity recommendation to a business "
        "stakeholder. Reference the specific numbers provided. Do not use generic AI hype language. "
        "Two to four sentences."
    )
    user_prompt = (
        f"Process: {process_name}. Top opportunity: {top['use_case_name']} at stage "
        f"'{top['stage_name']}', priority score {top['priority_score']}/100 "
        f"(business impact {top['factors']['business_impact']}, AI suitability {top['factors']['ai_suitability']}, "
        f"data readiness {top['factors']['data_readiness']}, time to value {top['factors']['time_to_value']}). "
        f"Annual transaction volume {assessment['annual_transaction_volume']:,}, error rate "
        f"{assessment['error_rate_pct']}%, manual effort {assessment['manual_effort_fte']} FTE. "
        + (f"Runner-up: {runner_up['use_case_name']} scored {runner_up['priority_score']}/100." if runner_up else "")
        + " Explain why the top opportunity is the best priority."
    )

    result = call_llm_structured(system_prompt, user_prompt, "recommendation_rationale", RATIONALE_SCHEMA)
    if result and result.get("rationale"):
        return {"rationale": result["rationale"], "source": "llm"}
    return {"rationale": _mock_rationale(top, runner_up, assessment, process_name), "source": "mock"}


def _mock_rationale(top: dict, runner_up: dict | None, assessment: dict, process_name: str) -> str:
    data_note = (
        "structured transaction data and historical records are already available"
        if assessment["structured_data_available"] and assessment["historical_records_available"]
        else "the required data is only partially available today"
    )
    comparison = (
        f" It outranks the next-best option, {runner_up['use_case_name']} ({runner_up['priority_score']}/100), "
        f"primarily on {'data readiness' if top['factors']['data_readiness'] > runner_up['factors']['data_readiness'] else 'business impact'}."
        if runner_up else ""
    )
    return (
        f"{top['use_case_name']} is the highest-priority opportunity in {process_name} because the organization "
        f"processes {assessment['annual_transaction_volume']:,} transactions per year through the "
        f"{top['stage_name']} stage, where {assessment['manual_effort_fte']} FTEs currently handle the work "
        f"manually and the error rate runs at {assessment['error_rate_pct']}%. It combines a high AI-suitability "
        f"score ({top['factors']['ai_suitability']}/100) with strong data readiness "
        f"({top['factors']['data_readiness']}/100), since {data_note}, resulting in a priority score of "
        f"{top['priority_score']}/100.{comparison}"
    )


# ------------------------------------------------------------ exec summary

def generate_executive_summary(
    assessment: dict, process_name: str, top_opportunity: dict, roi: dict, roadmap: list[dict], top_risks: list[dict]
) -> dict:
    system_prompt = (
        "You are a solution advisor writing a concise executive summary for a CXO audience. "
        "Each section must be 1-3 sentences, reference the specific numbers given, and avoid AI hype language."
    )
    user_prompt = (
        f"Industry: {assessment['industry']}. Process: {process_name}. Problem: {assessment['problem_description']}. "
        f"Volume: {assessment['annual_transaction_volume']:,}/year. Manual effort: {assessment['manual_effort_fte']} FTE. "
        f"Error rate: {assessment['error_rate_pct']}%. Recommended use case: {top_opportunity['use_case_name']} "
        f"(priority score {top_opportunity['priority_score']}/100). "
        f"Annual benefit: ${roi['savings']['annual_benefit']:,.0f}. ROI: {roi['returns']['roi_pct']}%. "
        f"Payback: {roi['returns']['payback_months']} months. Investment: "
        f"${roi['investment']['total_year1_investment']:,.0f}. "
        f"Roadmap phase 1: {roadmap[0]['name']} ({roadmap[0]['duration']}). "
        f"Top risk: {top_risks[0]['name']} ({top_risks[0]['severity']} severity) — mitigation: {top_risks[0]['mitigation']}. "
        "Write the ten executive summary sections."
    )

    result = call_llm_structured(system_prompt, user_prompt, "executive_summary", EXEC_SUMMARY_SCHEMA)
    if result:
        result["source"] = "llm"
        return result
    return {**_mock_executive_summary(assessment, process_name, top_opportunity, roi, roadmap, top_risks), "source": "mock"}


def _mock_executive_summary(assessment, process_name, top_opportunity, roi, roadmap, top_risks) -> dict:
    return {
        "business_challenge": (
            f"{assessment['industry']} organization's {process_name} process handles "
            f"{assessment['annual_transaction_volume']:,} transactions per year with {assessment['manual_effort_fte']} FTEs "
            f"of manual effort and a {assessment['error_rate_pct']}% error rate. {assessment['problem_description']}"
        ),
        "current_state": (
            f"Average processing time is {assessment['current_processing_time_minutes']} minutes per transaction, "
            f"with {assessment['sla_impact'].lower()} and {assessment['customer_impact'].lower()} customer impact today."
        ),
        "recommended_transformation": (
            f"Deploy {top_opportunity['use_case_name']} at the {top_opportunity['stage_name']} stage of the process, "
            f"scoring {top_opportunity['priority_score']}/100 on Pivotly's opportunity priority framework."
        ),
        "why_this_use_case": (
            f"This opportunity combines high AI suitability ({top_opportunity['factors']['ai_suitability']}/100) with "
            f"data readiness of {top_opportunity['factors']['data_readiness']}/100, giving it the strongest "
            "risk-adjusted priority score among the opportunities identified."
        ),
        "expected_business_impact": (
            f"Projected annual benefit of ${roi['savings']['annual_benefit']:,.0f}, combining "
            f"${roi['savings']['productivity_savings']:,.0f} in productivity savings and "
            f"${roi['savings']['error_reduction_savings']:,.0f} in error-reduction savings."
        ),
        "investment": (
            f"Total year-one investment of ${roi['investment']['total_year1_investment']:,.0f} "
            f"(${roi['investment']['implementation_cost']:,.0f} implementation, "
            f"${roi['investment']['annual_platform_cost']:,.0f} annual platform cost), "
            f"with an estimated ROI of {roi['returns']['roi_pct']}% and payback in "
            f"{roi['returns']['payback_months']} months."
        ),
        "implementation_approach": (
            f"A three-phase rollout beginning with {roadmap[0]['name']} ({roadmap[0]['duration']}), "
            f"followed by {roadmap[1]['name']} and {roadmap[2]['name']}."
        ),
        "key_risks": (
            f"The most significant risk is {top_risks[0]['name']} ({top_risks[0]['severity']} severity): "
            f"{top_risks[0]['mitigation']}"
        ),
        "success_metrics": (
            f"Success will be measured against {', '.join(roadmap[0]['kpis'])} during the pilot, and "
            f"{', '.join(roadmap[2]['kpis'])} at steady state."
        ),
        "next_steps": (
            "Approve pilot scope and budget, confirm data access for the pilot dataset, and assign a business "
            "owner accountable for the KPI targets defined in the roadmap."
        ),
    }


# --------------------------------------------------------- NL problem parse

_KEYWORD_HINTS = {
    "procure_to_pay": ["purchase order", "requisition", "supplier", "vendor invoice", "goods receipt"],
    "order_to_cash": ["customer order", "invoicing", "collections", "cash application", "accounts receivable"],
    "record_to_report": ["journal entr", "reconciliation", "financial close", "consolidation", "gl account"],
    "customer_service": ["ticket", "customer service", "support agent", "call center", "contact center"],
    "inventory_management": ["stock", "inventory", "warehouse", "replenishment", "cycle count"],
    "demand_planning": ["demand forecast", "forecasting", "demand plan"],
    "sales_operations": ["lead", "pipeline", "quote", "proposal", "crm opportunity"],
    "recruitment": ["candidate", "resume", "hiring", "recruit", "onboarding"],
    "invoice_processing": ["invoice", "ocr", "ap automation"],
    "claims_processing": ["claim", "adjuster", "policy", "fnol"],
    "asset_maintenance": ["asset", "maintenance", "work order", "technician", "equipment"],
    "loan_operations": ["loan", "underwriting", "credit application", "lending"],
    "content_operations": ["content", "editorial", "localization", "publishing", "media asset"],
}


def parse_natural_language_problem(free_text: str) -> dict:
    system_prompt = (
        "You map a free-text business problem description to the single best-matching business process ID "
        f"from this list: {list(PROCESSES.keys())}. Return your confidence and a one-sentence rationale."
    )
    result = call_llm_structured(system_prompt, free_text, "process_match", NL_PARSE_SCHEMA)
    if result and result.get("process_id") in PROCESSES:
        result["source"] = "llm"
        return result
    return {**_mock_parse(free_text), "source": "mock"}


def _mock_parse(free_text: str) -> dict:
    text = free_text.lower()
    scores = {pid: sum(1 for kw in kws if kw in text) for pid, kws in _KEYWORD_HINTS.items()}
    best_id, best_score = max(scores.items(), key=lambda kv: kv[1])
    if best_score == 0:
        best_id = "customer_service"
        confidence = "Low"
        rationale = "No strong keyword match found; defaulting to the most broadly applicable process."
    else:
        confidence = "High" if best_score >= 2 else "Medium"
        rationale = f"Matched {best_score} keyword(s) associated with {PROCESSES[best_id]['name']}."
    return {"process_id": best_id, "confidence": confidence, "rationale": rationale}
