from fastapi import APIRouter, HTTPException

from app.knowledge_base.scenarios import get_scenario, list_scenarios

router = APIRouter(prefix="/api/scenarios", tags=["scenarios"])


@router.get("")
def get_scenarios():
    return list_scenarios()


@router.get("/{scenario_id}")
def load_scenario(scenario_id: str):
    try:
        return get_scenario(scenario_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
