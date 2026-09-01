"""Risk register engine. Takes the generic risk catalog and bumps
severity/likelihood for risks that are genuinely more acute given the
assessment's industry, customer sensitivity, and data quality — rather than
showing the same 10 generic risks with the same rating for every scenario.
"""

from app.knowledge_base.risks import get_all_risks

_LEVELS = ["Low", "Medium", "High"]
REGULATED_INDUSTRIES = {"Banking", "Healthcare", "Public Sector"}


def _bump(level: str, amount: int) -> str:
    idx = _LEVELS.index(level)
    return _LEVELS[max(0, min(len(_LEVELS) - 1, idx + amount))]


def build_risk_register(assessment: dict, opportunity: dict | None = None) -> list[dict]:
    is_regulated = assessment["industry"] in REGULATED_INDUSTRIES
    high_customer_impact = assessment["customer_impact"] in {"High", "Critical"}
    low_data_quality = assessment["data_quality"] == "Low"
    high_opportunity_risk = bool(opportunity) and opportunity["factors"]["risk"] >= 50

    register = []
    for risk in get_all_risks():
        severity = risk["baseline_severity"]
        likelihood = risk["baseline_likelihood"]

        if risk["id"] in {"regulatory", "data_privacy"} and is_regulated:
            severity = _bump(severity, 1)
        if risk["id"] in {"hallucination", "bias"} and high_customer_impact:
            severity = _bump(severity, 1)
        if risk["id"] == "data_quality" and low_data_quality:
            severity = _bump(severity, 1)
            likelihood = _bump(likelihood, 1)
        if risk["id"] == "model_drift" and low_data_quality:
            likelihood = _bump(likelihood, 1)
        if risk["id"] == "human_oversight" and high_opportunity_risk:
            severity = _bump(severity, 1)

        register.append({
            "id": risk["id"],
            "name": risk["name"],
            "category": risk["category"],
            "severity": severity,
            "likelihood": likelihood,
            "description": risk["description"],
            "mitigation": risk["mitigation"],
        })

    severity_rank = {"High": 0, "Medium": 1, "Low": 2}
    return sorted(register, key=lambda r: severity_rank[r["severity"]])
