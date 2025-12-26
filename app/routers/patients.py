from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.deps import get_db, get_current_user
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientOut, PatientUpdate

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("", response_model=list[PatientOut])
def list_patients(q: str | None = None, db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(Patient)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Patient.first_name.ilike(like), Patient.last_name.ilike(like), Patient.national_id.ilike(like)))
    return query.order_by(Patient.last_name.asc(), Patient.first_name.asc()).limit(200).all()

@router.post("", response_model=PatientOut)
def create_patient(data: PatientCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = Patient(**data.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(404, "Patient not found")
    return p

@router.patch("/{patient_id}", response_model=PatientOut)
def update_patient(patient_id: int, data: PatientUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(404, "Patient not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(404, "Patient not found")
    db.delete(p)
    db.commit()
    return {"ok": True}
