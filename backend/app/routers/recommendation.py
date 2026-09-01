from fastapi import APIRouter, HTTPException

from app.ai.reasoning import generate_recommendation_rationale
from app.engines.pipeline import get_ranked_opportunities
from app.knowledge_base.processes import get_process
from app.schemas import AssessmentInput

router = APIRouter(prefix="/api/recommendation", tags=["recommendation"])


@router.post("")
def get_recommendation(assessment: AssessmentInput):
    data = assessment.model_dump()
    ranked = get_ranked_opportunities(data)
    if not ranked:
        raise HTTPException(status_code=422, detail="No AI opportunities could be identified for this input.")

    process_name = get_process(data["process_id"])["name"]
    rationale = generate_recommendation_rationale(ranked, data, process_name)

    return {
        "ranked_opportunities": ranked,
        "recommended": ranked[0],
        "rationale": rationale["rationale"],
        "rationale_source": rationale["source"],
    }
