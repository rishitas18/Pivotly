from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_ok():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_full_demo_flow_end_to_end():
    scenario = client.get("/api/scenarios/manufacturing_p2p").json()
    assessment = scenario["assessment"]

    process_result = client.post("/api/process/analyze", json=assessment)
    assert process_result.status_code == 200
    assert len(process_result.json()["stages"]) > 0

    opportunities_result = client.post("/api/opportunities", json=assessment)
    assert opportunities_result.status_code == 200
    opportunities = opportunities_result.json()
    assert len(opportunities) > 0
    top_opportunity_id = opportunities[0]["id"]

    recommendation_result = client.post("/api/recommendation", json=assessment)
    assert recommendation_result.status_code == 200
    rec = recommendation_result.json()
    assert rec["recommended"]["id"] == top_opportunity_id
    assert len(rec["rationale"]) > 0

    architecture_result = client.post(
        "/api/architecture", json={"assessment": assessment, "opportunity_id": top_opportunity_id}
    )
    assert architecture_result.status_code == 200
    assert len(architecture_result.json()["layers"]) == 6

    ecosystem_result = client.post(
        "/api/architecture/ecosystem", json={"process_id": assessment["process_id"], "ecosystem_key": "sap"}
    )
    assert ecosystem_result.status_code == 200
    assert ecosystem_result.json()["disclaimer"]

    business_case_result = client.post("/api/business-case", json=assessment)
    assert business_case_result.status_code == 200
    assert "roi_pct" in business_case_result.json()["returns"]

    roadmap_result = client.post(
        "/api/roadmap", json={"assessment": assessment, "opportunity_id": top_opportunity_id}
    )
    assert roadmap_result.status_code == 200
    assert len(roadmap_result.json()) == 3

    risks_result = client.post(
        "/api/risks", json={"assessment": assessment, "opportunity_id": top_opportunity_id}
    )
    assert risks_result.status_code == 200
    assert len(risks_result.json()) == 10

    stakeholders_result = client.post(
        "/api/risks/stakeholders", json={"assessment": assessment, "opportunity_id": top_opportunity_id}
    )
    assert stakeholders_result.status_code == 200
    assert len(stakeholders_result.json()) == 8

    exec_summary_result = client.post(
        "/api/executive-summary", json={"assessment": assessment, "opportunity_id": top_opportunity_id}
    )
    assert exec_summary_result.status_code == 200
    summary = exec_summary_result.json()["summary"]
    assert "business_challenge" in summary
    assert "next_steps" in summary


def test_all_scenarios_load_and_produce_opportunities():
    scenarios = client.get("/api/scenarios").json()
    assert len(scenarios) == 6
    for s in scenarios:
        full = client.get(f"/api/scenarios/{s['id']}").json()
        opportunities = client.post("/api/opportunities", json=full["assessment"])
        assert opportunities.status_code == 200
        assert len(opportunities.json()) > 0


def test_invalid_assessment_rejected():
    response = client.post("/api/process/analyze", json={"process_id": "procure_to_pay"})
    assert response.status_code == 422


def test_unknown_scenario_returns_404():
    response = client.get("/api/scenarios/does-not-exist")
    assert response.status_code == 404


def test_nl_parse_mock_mode_returns_valid_process(manufacturing_assessment):
    response = client.post("/api/nl-parse", json={"free_text": "We receive supplier invoices by email and manually match them to purchase orders."})
    assert response.status_code == 200
    body = response.json()
    assert body["process_id"] == "procure_to_pay"
