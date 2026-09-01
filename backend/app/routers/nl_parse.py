from fastapi import APIRouter

from app.ai.reasoning import parse_natural_language_problem
from app.schemas import NaturalLanguageProblemRequest

router = APIRouter(prefix="/api/nl-parse", tags=["nl-parse"])


@router.post("")
def parse_problem(request: NaturalLanguageProblemRequest):
    return parse_natural_language_problem(request.free_text)
