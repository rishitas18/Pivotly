from fastapi import APIRouter

from app.engines.pipeline import get_ranked_opportunities, select_opportunity
from app.engines.risk_register import build_risk_register
from app.engines.stakeholders import build_stakeholder_map
from app.schemas import AssessmentWithOpportunity

router = APIRouter(prefix="/api/risks", tags=["risks"])


@router.post("")
def get_risks(request: AssessmentWithOpportunity):
    data = request.assessment.model_dump()
    ranked = get_ranked_opportunities(data)
    opportunity = select_opportunity(ranked, request.opportunity_id) if ranked else None
    return build_risk_register(data, opportunity)


@router.post("/stakeholders")
def get_stakeholders(request: AssessmentWithOpportunity):
    data = request.assessment.model_dump()
    ranked = get_ranked_opportunities(data)
    opportunity = select_opportunity(ranked, request.opportunity_id)
    return build_stakeholder_map(opportunity, data)
