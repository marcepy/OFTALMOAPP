from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.patient import Patient
from app.models.encounter import Encounter
from app.schemas.encounter import EncounterCreate, EncounterOut

router = APIRouter(prefix="/patients/{patient_id}/encounters", tags=["encounters"])

@router.get("", response_model=list[EncounterOut])
def list_encounters(patient_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    if not db.query(Patient).filter(Patient.id == patient_id).first():
        raise HTTPException(404, "Patient not found")
    return (
        db.query(Encounter)
        .filter(Encounter.patient_id == patient_id)
        .order_by(Encounter.created_at.desc())
        .limit(200)
        .all()
    )

@router.post("", response_model=EncounterOut)
def create_encounter(patient_id: int, data: EncounterCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    if not db.query(Patient).filter(Patient.id == patient_id).first():
        raise HTTPException(404, "Patient not found")
    e = Encounter(patient_id=patient_id, **data.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e
