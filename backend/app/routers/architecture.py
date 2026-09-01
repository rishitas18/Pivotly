from fastapi import APIRouter, HTTPException

from app.engines.architecture import build_architecture
from app.engines.pipeline import get_ranked_opportunities, select_opportunity
from app.knowledge_base.platforms import get_ecosystem_mapping
from app.knowledge_base.processes import get_process
from app.schemas import AssessmentWithOpportunity, EcosystemMappingRequest

router = APIRouter(prefix="/api/architecture", tags=["architecture"])


@router.post("")
def get_architecture(request: AssessmentWithOpportunity):
    data = request.assessment.model_dump()
    ranked = get_ranked_opportunities(data)
    try:
        opportunity = select_opportunity(ranked, request.opportunity_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return build_architecture(opportunity, data)


@router.post("/ecosystem")
def get_ecosystem(request: EcosystemMappingRequest):
    process = get_process(request.process_id)
    try:
        return get_ecosystem_mapping(process["category"], request.ecosystem_key)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
