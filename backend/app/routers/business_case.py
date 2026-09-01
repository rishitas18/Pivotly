from fastapi import APIRouter

from app.engines.roi import calculate_roi
from app.schemas import AssessmentInput

router = APIRouter(prefix="/api/business-case", tags=["business-case"])


@router.post("")
def get_business_case(assessment: AssessmentInput):
    return calculate_roi(assessment.model_dump())
