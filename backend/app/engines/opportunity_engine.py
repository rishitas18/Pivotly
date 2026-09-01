"""AI opportunity engine — pure functions, no I/O, no LLM.

Every opportunity returned here is anchored to a (process, stage) template
in the knowledge base (see opportunity_templates.py) — this module never
invents a use case. Its job is to take the template's baseline scores and
adjust them using the user's actual assessment inputs, producing the seven
factors that scoring.py turns into a priority score.
"""

from app.engines.process_analysis import analyze_process
from app.knowledge_base.opportunity_templates import get_template

REGULATED_INDUSTRIES = {"Banking", "Healthcare", "Public Sector"}


def _clamp(value: float) -> int:
    return max(0, min(100, round(value)))


def data_readiness_score(assessment: dict) -> int:
    """0-100 score of how ready the organization's data is to support an AI
    solution, built from the Step 3 readiness flags plus overall data quality."""
    score = 0
    score += 30 if assessment["structured_data_available"] else 0
    score += 15 if assessment["unstructured_documents_available"] else 0
    score += 10 if assessment["email_data_available"] else 0
    score += 20 if assessment["historical_records_available"] else 0
    score += 15 if assessment["apis_available"] else 0
    score += 10 if assessment["existing_erp_crm"] else 0
    score += {"Low": -25, "Medium": -10, "High": 0}.get(assessment["data_quality"], 0)
    return _clamp(score)


def _volume_bonus(annual_transaction_volume: int) -> float:
    if annual_transaction_volume <= 10_000:
        return 0
    if annual_transaction_volume <= 100_000:
        return 5
    if annual_transaction_volume <= 500_000:
        return 10
    if annual_transaction_volume <= 1_000_000:
        return 14
    return 18


def build_opportunities(assessment: dict) -> list[dict]:
    process_map = analyze_process(assessment)
    readiness = data_readiness_score(assessment)
    volume_bonus = _volume_bonus(assessment["annual_transaction_volume"])
    error_bonus = min(15, assessment["error_rate_pct"] / 2)
    n_systems = len(assessment.get("enterprise_systems") or [])
    is_regulated = assessment["industry"] in REGULATED_INDUSTRIES
    high_customer_impact = assessment["customer_impact"] in {"High", "Critical"}

    opportunities = []
    for stage in process_map["stages"]:
        template = get_template(assessment["process_id"], stage["id"])
        if not template:
            continue

        business_value = _clamp(template["business_value_baseline"] + volume_bonus + error_bonus)
        business_impact_factor = _clamp((stage["business_impact"] + business_value) / 2)

        technical_feasibility = _clamp(
            template["technical_feasibility_baseline"]
            + (5 if assessment["apis_available"] else 0)
            + (5 if assessment["existing_erp_crm"] else 0)
            + (-10 if assessment["data_quality"] == "Low" else 0)
        )

        time_to_value = _clamp(
            template["time_to_value_baseline"]
            + (5 if readiness >= 70 else (-10 if readiness < 40 else 0))
            + (-5 if n_systems > 1 else 0)
        )

        implementation_complexity = _clamp(
            template["implementation_complexity_baseline"]
            + min(15, n_systems * 3)
            + (-8 if assessment["apis_available"] else 0)
            + (-5 if assessment["existing_erp_crm"] else 0)
        )

        risk = _clamp(
            template["risk_baseline"]
            + (10 if is_regulated else 0)
            + (8 if high_customer_impact else 0)
        )

        opportunities.append({
            "id": f"{assessment['process_id']}:{stage['id']}",
            "stage_id": stage["id"],
            "stage_name": stage["name"],
            "use_case_name": template["use_case_name"],
            "business_problem": stage["description"],
            "ai_capability": template["ai_capability"],
            "required_data": template["required_data"],
            "description": template["description"],
            "factors": {
                "business_impact": business_impact_factor,
                "ai_suitability": stage["ai_suitability"],
                "technical_feasibility": technical_feasibility,
                "data_readiness": readiness,
                "time_to_value": time_to_value,
                "implementation_complexity": implementation_complexity,
                "risk": risk,
            },
        })

    return opportunities
