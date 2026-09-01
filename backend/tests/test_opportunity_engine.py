from app.engines.opportunity_engine import build_opportunities, data_readiness_score
from app.engines.pipeline import get_ranked_opportunities, select_opportunity
from app.knowledge_base.opportunity_templates import get_template


def test_every_opportunity_is_grounded_in_a_template(manufacturing_assessment):
    opportunities = build_opportunities(manufacturing_assessment)
    assert len(opportunities) > 0
    for opp in opportunities:
        template = get_template(manufacturing_assessment["process_id"], opp["stage_id"])
        assert template is not None
        assert opp["use_case_name"] == template["use_case_name"]


def test_factor_values_within_bounds(manufacturing_assessment):
    opportunities = build_opportunities(manufacturing_assessment)
    for opp in opportunities:
        for value in opp["factors"].values():
            assert 0 <= value <= 100


def test_data_readiness_full_flags_scores_high():
    assessment = {
        "structured_data_available": True, "unstructured_documents_available": True,
        "email_data_available": True, "historical_records_available": True,
        "apis_available": True, "existing_erp_crm": True, "data_quality": "High",
    }
    assert data_readiness_score(assessment) == 100


def test_data_readiness_no_flags_scores_zero():
    assessment = {
        "structured_data_available": False, "unstructured_documents_available": False,
        "email_data_available": False, "historical_records_available": False,
        "apis_available": False, "existing_erp_crm": False, "data_quality": "Low",
    }
    assert data_readiness_score(assessment) == 0


def test_regulated_industry_raises_risk_factor(manufacturing_assessment, retail_assessment):
    banking_like = {**manufacturing_assessment, "industry": "Banking", "customer_impact": "Low"}
    non_regulated = {**manufacturing_assessment, "industry": "Manufacturing", "customer_impact": "Low"}

    banking_opps = {o["id"]: o for o in build_opportunities(banking_like)}
    baseline_opps = {o["id"]: o for o in build_opportunities(non_regulated)}

    key = next(iter(baseline_opps))
    assert banking_opps[key]["factors"]["risk"] >= baseline_opps[key]["factors"]["risk"]


def test_select_opportunity_falls_back_to_top(manufacturing_assessment):
    ranked = get_ranked_opportunities(manufacturing_assessment)
    selected = select_opportunity(ranked, opportunity_id="does-not-exist")
    assert selected["id"] == ranked[0]["id"]


def test_select_opportunity_by_id(manufacturing_assessment):
    ranked = get_ranked_opportunities(manufacturing_assessment)
    target = ranked[-1]
    selected = select_opportunity(ranked, opportunity_id=target["id"])
    assert selected["id"] == target["id"]


def test_select_opportunity_raises_on_empty_list():
    import pytest

    with pytest.raises(ValueError):
        select_opportunity([], opportunity_id=None)
