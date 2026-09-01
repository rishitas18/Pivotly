"""Process analysis engine — pure functions, no I/O.

Takes the knowledge-base baseline for the selected process and adjusts each
stage's ratings using the user's actual assessment inputs, so the process
map reflects THIS organization's situation rather than a generic template.
All adjustment rules are simple, documented, and clamped to 0-100 — see
BUSINESS_LOGIC.md for the full rationale.
"""

from app.knowledge_base.processes import get_process


def _clamp(value: float) -> int:
    return max(0, min(100, round(value)))


def _volume_bonus(annual_transaction_volume: int) -> float:
    """Higher transaction volume raises the business impact of fixing a
    bottleneck, since the same % improvement compounds across more
    transactions. Log-scaled so it doesn't dominate at extreme volumes."""
    if annual_transaction_volume <= 10_000:
        return 0
    if annual_transaction_volume <= 100_000:
        return 5
    if annual_transaction_volume <= 500_000:
        return 10
    if annual_transaction_volume <= 1_000_000:
        return 14
    return 18


def _automation_offset(existing_automation: str) -> int:
    text = existing_automation.lower()
    if "significant" in text or "extensive" in text:
        return -18
    if "partial" in text or "basic" in text:
        return -8
    return 0


def _data_quality_offset(data_quality: str) -> int:
    return {"Low": -15, "Medium": 0, "High": 8}.get(data_quality, 0)


def adjust_stage(stage: dict, assessment: dict) -> dict:
    volume_bonus = _volume_bonus(assessment["annual_transaction_volume"])
    error_bonus = min(15, assessment["error_rate_pct"] / 2)
    automation_offset = _automation_offset(assessment["existing_automation"])
    dq_offset = _data_quality_offset(assessment["data_quality"])

    adjusted_business_impact = _clamp(stage["business_impact"] + volume_bonus + error_bonus)
    adjusted_bottleneck = _clamp(stage["bottleneck_potential"] + error_bonus + automation_offset)
    adjusted_ai_suitability = _clamp(stage["ai_suitability"] + dq_offset)
    adjusted_automation_potential = _clamp(stage["automation_potential"] + dq_offset)

    return {
        **stage,
        "business_impact": adjusted_business_impact,
        "bottleneck_potential": adjusted_bottleneck,
        "ai_suitability": adjusted_ai_suitability,
        "automation_potential": adjusted_automation_potential,
        "baseline": {
            "business_impact": stage["business_impact"],
            "bottleneck_potential": stage["bottleneck_potential"],
            "ai_suitability": stage["ai_suitability"],
            "automation_potential": stage["automation_potential"],
        },
    }


def analyze_process(assessment: dict) -> dict:
    process = get_process(assessment["process_id"])
    adjusted_stages = [adjust_stage(stage, assessment) for stage in process["stages"]]
    ranked_by_bottleneck = sorted(adjusted_stages, key=lambda s: s["bottleneck_potential"], reverse=True)

    return {
        "process": {
            "id": process["id"],
            "name": process["name"],
            "category": process["category"],
            "description": process["description"],
        },
        "stages": adjusted_stages,
        "top_bottlenecks": [
            {"stage_id": s["id"], "stage_name": s["name"], "bottleneck_potential": s["bottleneck_potential"]}
            for s in ranked_by_bottleneck[:3]
        ],
    }
