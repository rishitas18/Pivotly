from fastapi import APIRouter

from app.engines.pipeline import get_ranked_opportunities
from app.schemas import AssessmentInput

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])


@router.post("")
def get_opportunities(assessment: AssessmentInput):
    return get_ranked_opportunities(assessment.model_dump())
