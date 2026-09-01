from fastapi import APIRouter

from app.engines.process_analysis import analyze_process
from app.schemas import AssessmentInput

router = APIRouter(prefix="/api/process", tags=["process"])


@router.post("/analyze")
def analyze(assessment: AssessmentInput):
    return analyze_process(assessment.model_dump())
