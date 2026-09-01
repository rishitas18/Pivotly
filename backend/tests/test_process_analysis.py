from app.engines.process_analysis import analyze_process
from app.knowledge_base.processes import PROCESSES


def test_analyze_process_returns_all_stages(manufacturing_assessment):
    result = analyze_process(manufacturing_assessment)
    baseline_stage_count = len(PROCESSES["procure_to_pay"]["stages"])
    assert len(result["stages"]) == baseline_stage_count


def test_all_ratings_within_bounds(manufacturing_assessment):
    result = analyze_process(manufacturing_assessment)
    for stage in result["stages"]:
        for field in ("business_impact", "bottleneck_potential", "ai_suitability", "automation_potential"):
            assert 0 <= stage[field] <= 100


def test_top_bottlenecks_sorted_descending(manufacturing_assessment):
    result = analyze_process(manufacturing_assessment)
    scores = [b["bottleneck_potential"] for b in result["top_bottlenecks"]]
    assert scores == sorted(scores, reverse=True)
    assert len(result["top_bottlenecks"]) == 3


def test_higher_volume_raises_business_impact(manufacturing_assessment):
    low_volume = analyze_process({**manufacturing_assessment, "annual_transaction_volume": 5_000})
    high_volume = analyze_process({**manufacturing_assessment, "annual_transaction_volume": 2_000_000})

    low_stage = next(s for s in low_volume["stages"] if s["id"] == "invoice_matching")
    high_stage = next(s for s in high_volume["stages"] if s["id"] == "invoice_matching")
    assert high_stage["business_impact"] > low_stage["business_impact"]


def test_low_data_quality_reduces_ai_suitability(manufacturing_assessment):
    high_quality = analyze_process({**manufacturing_assessment, "data_quality": "High"})
    low_quality = analyze_process({**manufacturing_assessment, "data_quality": "Low"})

    high_stage = next(s for s in high_quality["stages"] if s["id"] == "invoice_receipt")
    low_stage = next(s for s in low_quality["stages"] if s["id"] == "invoice_receipt")
    assert low_stage["ai_suitability"] < high_stage["ai_suitability"]


def test_unknown_process_id_raises():
    import pytest

    with pytest.raises(KeyError):
        analyze_process({"process_id": "not_a_real_process", "annual_transaction_volume": 1,
                          "error_rate_pct": 1, "existing_automation": "None", "data_quality": "Medium"})
