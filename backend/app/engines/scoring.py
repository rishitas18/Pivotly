"""AI opportunity scoring engine — pure, deterministic, fully transparent.

Formula (weights sum to 1.0 across seven factors, three of which are
penalties):

    raw = business_impact       * 0.25
        + ai_suitability        * 0.20
        + technical_feasibility * 0.15
        + data_readiness        * 0.15
        + time_to_value         * 0.10
        - implementation_complexity * 0.10
        - risk                  * 0.05

With every factor in [0, 100], raw ranges from -15 (worst case: all
penalties maxed, all benefits zero) to 85 (best case). PriorityScore adds a
flat +15 to re-center that range onto 0-100 rather than 0-85, then clamps —
so a perfect-factor opportunity scores 100 and a worst-case one scores 0.
The full weighted breakdown is returned alongside the final score so the UI
can show the calculation, not just the result. See BUSINESS_LOGIC.md.
"""

WEIGHTS = {
    "business_impact": 0.25,
    "ai_suitability": 0.20,
    "technical_feasibility": 0.15,
    "data_readiness": 0.15,
    "time_to_value": 0.10,
    "implementation_complexity": -0.10,
    "risk": -0.05,
}

RECENTER_OFFSET = 15


def score_opportunity(factors: dict) -> dict:
    contributions = {name: round(factors[name] * weight, 2) for name, weight in WEIGHTS.items()}
    raw = sum(contributions.values())
    priority_score = max(0, min(100, round(raw + RECENTER_OFFSET)))
    return {
        "factors": factors,
        "weights": WEIGHTS,
        "contributions": contributions,
        "raw_score": round(raw, 2),
        "recenter_offset": RECENTER_OFFSET,
        "priority_score": priority_score,
    }


def score_and_rank(opportunities: list[dict]) -> list[dict]:
    scored = []
    for opp in opportunities:
        scoring = score_opportunity(opp["factors"])
        scored.append({**opp, "scoring": scoring, "priority_score": scoring["priority_score"]})
    return sorted(scored, key=lambda o: o["priority_score"], reverse=True)
