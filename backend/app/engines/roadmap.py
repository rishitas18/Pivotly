"""Implementation roadmap engine. Builds a 3-phase roadmap whose duration
estimates and activities are derived from the selected opportunity's actual
complexity and required data/integrations, rather than a fixed template.

Duration formula (weeks, deterministic):
    pilot_weeks  = 6  + round(complexity / 10)
    scale_weeks  = 8  + round(complexity / 8)
    rollout_weeks = 10 + round(complexity / 6)
"""

from app.knowledge_base.kpis import get_kpis_for_process
from app.knowledge_base.risks import get_all_risks


def build_roadmap(opportunity: dict, assessment: dict) -> list[dict]:
    complexity = opportunity["factors"]["implementation_complexity"]
    use_case = opportunity["use_case_name"]
    required_data = opportunity["required_data"]
    enterprise_systems = assessment.get("enterprise_systems") or ["existing systems"]

    pilot_weeks = 6 + round(complexity / 10)
    scale_weeks = 8 + round(complexity / 8)
    rollout_weeks = 10 + round(complexity / 6)

    kpis = get_kpis_for_process(assessment["process_id"])
    leading_kpis = [k["name"] for k in kpis if k["type"] == "leading"][:3]
    lagging_kpis = [k["name"] for k in kpis if k["type"] == "lagging"][:3]

    risk_names = [r["name"] for r in get_all_risks() if r["category"] in ("Model", "Data")][:3]
    governance_risk_names = [r["name"] for r in get_all_risks() if r["category"] in ("Governance", "Compliance")][:2]

    return [
        {
            "phase": "Phase 1",
            "name": "Discover & Pilot",
            "duration": f"~{pilot_weeks} weeks",
            "objectives": [
                f"Validate {use_case} on a limited scope before committing to full build",
                "Confirm data readiness and close any gaps",
            ],
            "activities": [
                f"Data readiness assessment for: {', '.join(required_data)}",
                "Build and validate the AI capability against a pilot dataset",
                "Define human-in-the-loop approval workflow and escalation rules",
                "Establish baseline KPI measurement",
            ],
            "technology": ["Pilot AI model/service", "Sandbox integration with source data"],
            "stakeholders": ["Business Owner", "Data / AI Team", "End Users"],
            "kpis": leading_kpis,
            "risks": risk_names,
            "success_criteria": "Pilot model meets the accuracy/quality threshold agreed with the business owner, and pilot users adopt the new workflow.",
        },
        {
            "phase": "Phase 2",
            "name": "Integrate & Scale",
            "duration": f"~{scale_weeks} weeks",
            "objectives": [
                f"Integrate with {', '.join(enterprise_systems)} and expand beyond the pilot scope",
                "Stand up production monitoring and governance",
            ],
            "activities": [
                "Build production integrations to source and downstream systems",
                "Expand rollout to additional teams / sites / volume",
                "Implement model monitoring, drift detection, and audit logging",
                "Train end users and update standard operating procedures",
            ],
            "technology": ["Production AI service", "Workflow orchestration", "Monitoring dashboard"],
            "stakeholders": ["IT Owner", "Security", "Operations", "Product Owner"],
            "kpis": [k for k in leading_kpis if k not in leading_kpis[:1]] or leading_kpis,
            "risks": governance_risk_names,
            "success_criteria": "Solution operates at expanded scale within SLA, with monitoring showing stable model performance.",
        },
        {
            "phase": "Phase 3",
            "name": "Enterprise Rollout",
            "duration": f"~{rollout_weeks} weeks",
            "objectives": [
                "Roll out to full transaction volume and all relevant business units",
                "Transition to steady-state operations and continuous improvement",
            ],
            "activities": [
                "Full-scale rollout across remaining sites / regions / business units",
                "Establish a continuous improvement cadence using leading KPIs",
                "Formal handover from project team to steady-state process owners",
            ],
            "technology": ["Fully integrated production architecture"],
            "stakeholders": ["Business Owner", "Finance", "End Users"],
            "kpis": lagging_kpis,
            "risks": [],
            "success_criteria": "Lagging KPIs (cost, cycle time, error rate) show the improvement projected in the business case.",
        },
    ]
