from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Assessment
from app.schemas import AssessmentInput, SaveAssessmentRequest

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.post("")
def save_assessment(request: SaveAssessmentRequest, db: Session = Depends(get_db)):
    record = Assessment(
        name=request.name,
        scenario_id=request.scenario_id,
        payload=request.assessment.model_dump(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "name": record.name, "scenario_id": record.scenario_id, "payload": record.payload}


@router.get("")
def list_assessments(db: Session = Depends(get_db)):
    records = db.query(Assessment).order_by(Assessment.updated_at.desc()).limit(50).all()
    return [
        {"id": r.id, "name": r.name, "scenario_id": r.scenario_id, "updated_at": r.updated_at.isoformat()}
        for r in records
    ]


@router.get("/{assessment_id}")
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    record = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"id": record.id, "name": record.name, "scenario_id": record.scenario_id, "payload": record.payload}


@router.post("/validate")
def validate_assessment(assessment: AssessmentInput):
    """Lets the frontend validate a draft assessment before moving to the
    next step, without persisting anything."""
    return {"valid": True, "assessment": assessment.model_dump()}
