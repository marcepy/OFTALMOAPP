from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentOut, AppointmentUpdate

router = APIRouter(prefix="/appointments", tags=["appointments"])

def _to_out(a: Appointment) -> AppointmentOut:
    tags = [t for t in (a.tags_text or "").split(",") if t]
    return AppointmentOut(
        id=a.id,
        title=a.title,
        specialist=a.specialist,
        location=a.location,
        start_at=a.start_at,
        end_at=a.end_at,
        status=a.status,
        type=a.type,
        channel=a.channel,
        tags=tags,
        notes=a.notes,
        patient_id=a.patient_id,
        online=a.online,
    )

@router.get("", response_model=list[AppointmentOut])
def list_appointments(
    start: datetime | None = Query(None),
    end: datetime | None = Query(None),
    specialist: str | None = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    start = start or datetime.utcnow()
    end = end or (start + timedelta(days=30))
    q = db.query(Appointment).filter(Appointment.start_at >= start, Appointment.end_at <= end)
    if specialist:
        q = q.filter(Appointment.specialist.ilike(f"%{specialist}%"))
    q = q.order_by(Appointment.start_at.asc())
    return [_to_out(a) for a in q.all()]

@router.post("", response_model=AppointmentOut)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    a = Appointment(
        title=data.title,
        specialist=data.specialist,
        location=data.location,
        start_at=data.start_at,
        end_at=data.end_at,
        status=data.status,
        type=data.type,
        channel=data.channel,
        tags_text=",".join(data.tags),
        notes=data.notes,
        patient_id=data.patient_id,
        online=data.online,
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return _to_out(a)

@router.patch("/{appointment_id}", response_model=AppointmentOut)
def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    a = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not a:
        raise HTTPException(404, "Appointment not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        if k == "tags" and v is not None:
            a.tags_text = ",".join(v)
        else:
            setattr(a, k, v)
    db.commit()
    db.refresh(a)
    return _to_out(a)

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    a = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not a:
        raise HTTPException(404, "Appointment not found")
    db.delete(a)
    db.commit()
    return {"ok": True}
