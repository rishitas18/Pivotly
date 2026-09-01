from fastapi import APIRouter, HTTPException

from app.ai.reasoning import generate_executive_summary
from app.engines.pipeline import get_ranked_opportunities, select_opportunity
from app.engines.risk_register import build_risk_register
from app.engines.roadmap import build_roadmap
from app.engines.roi import calculate_roi
from app.knowledge_base.processes import get_process
from app.schemas import AssessmentWithOpportunity

router = APIRouter(prefix="/api/executive-summary", tags=["executive-summary"])


@router.post("")
def get_executive_summary(request: AssessmentWithOpportunity):
    data = request.assessment.model_dump()
    ranked = get_ranked_opportunities(data)
    try:
        opportunity = select_opportunity(ranked, request.opportunity_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    process_name = get_process(data["process_id"])["name"]
    roi = calculate_roi(data)
    roadmap = build_roadmap(opportunity, data)
    risks = build_risk_register(data, opportunity)

    summary = generate_executive_summary(data, process_name, opportunity, roi, roadmap, risks)

    return {
        "summary": summary,
        "supporting_data": {
            "opportunity": opportunity,
            "roi": roi,
            "roadmap": roadmap,
            "top_risks": risks[:3],
        },
    }
