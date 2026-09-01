from fastapi import APIRouter, HTTPException

from app.engines.pipeline import get_ranked_opportunities, select_opportunity
from app.engines.roadmap import build_roadmap
from app.schemas import AssessmentWithOpportunity

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("")
def get_roadmap(request: AssessmentWithOpportunity):
    data = request.assessment.model_dump()
    ranked = get_ranked_opportunities(data)
    try:
        opportunity = select_opportunity(ranked, request.opportunity_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return build_roadmap(opportunity, data)
