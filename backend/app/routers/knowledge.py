from fastapi import APIRouter

from app.knowledge_base.kpis import get_kpis_for_process
from app.knowledge_base.platforms import list_ecosystems
from app.knowledge_base.processes import list_processes
from app.schemas import BUSINESS_FUNCTIONS, COMPANY_SIZES, ENTERPRISE_SYSTEM_OPTIONS, INDUSTRIES

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])


@router.get("/options")
def get_options():
    return {
        "industries": INDUSTRIES,
        "company_sizes": COMPANY_SIZES,
        "business_functions": BUSINESS_FUNCTIONS,
        "enterprise_systems": ENTERPRISE_SYSTEM_OPTIONS,
        "ecosystems": list_ecosystems(),
    }


@router.get("/processes")
def get_processes():
    return list_processes()


@router.get("/kpis/{process_id}")
def get_kpis(process_id: str):
    return get_kpis_for_process(process_id)
