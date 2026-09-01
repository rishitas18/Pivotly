from app.engines.scoring import RECENTER_OFFSET, WEIGHTS, score_and_rank, score_opportunity


def test_perfect_factors_score_100():
    factors = {
        "business_impact": 100, "ai_suitability": 100, "technical_feasibility": 100,
        "data_readiness": 100, "time_to_value": 100, "implementation_complexity": 0, "risk": 0,
    }
    result = score_opportunity(factors)
    assert result["priority_score"] == 100


def test_worst_factors_score_0():
    factors = {
        "business_impact": 0, "ai_suitability": 0, "technical_feasibility": 0,
        "data_readiness": 0, "time_to_value": 0, "implementation_complexity": 100, "risk": 100,
    }
    result = score_opportunity(factors)
    assert result["priority_score"] == 0


def test_formula_matches_hand_calculation():
    factors = {
        "business_impact": 91, "ai_suitability": 95, "technical_feasibility": 87,
        "data_readiness": 76, "time_to_value": 84, "implementation_complexity": 42, "risk": 28,
    }
    result = score_opportunity(factors)
    expected_raw = (
        91 * 0.25 + 95 * 0.20 + 87 * 0.15 + 76 * 0.15 + 84 * 0.10 - 42 * 0.10 - 28 * 0.05
    )
    assert result["raw_score"] == round(expected_raw, 2)
    assert result["priority_score"] == max(0, min(100, round(expected_raw + RECENTER_OFFSET)))


def test_weights_sum_to_one_in_magnitude():
    positive = sum(w for w in WEIGHTS.values() if w > 0)
    negative = sum(-w for w in WEIGHTS.values() if w < 0)
    assert round(positive, 2) == 0.85
    assert round(negative, 2) == 0.15
    assert round(positive - negative, 2) == 0.70


def test_score_and_rank_orders_descending():
    opps = [
        {"id": "a", "factors": {
            "business_impact": 50, "ai_suitability": 50, "technical_feasibility": 50,
            "data_readiness": 50, "time_to_value": 50, "implementation_complexity": 50, "risk": 50,
        }},
        {"id": "b", "factors": {
            "business_impact": 90, "ai_suitability": 90, "technical_feasibility": 90,
            "data_readiness": 90, "time_to_value": 90, "implementation_complexity": 10, "risk": 10,
        }},
    ]
    ranked = score_and_rank(opps)
    assert ranked[0]["id"] == "b"
    assert ranked[0]["priority_score"] >= ranked[1]["priority_score"]


def test_score_never_out_of_bounds_for_extreme_inputs():
    factors = {
        "business_impact": 100, "ai_suitability": 100, "technical_feasibility": 100,
        "data_readiness": 100, "time_to_value": 100, "implementation_complexity": 100, "risk": 100,
    }
    result = score_opportunity(factors)
    assert 0 <= result["priority_score"] <= 100
