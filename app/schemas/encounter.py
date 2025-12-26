from pydantic import BaseModel
from datetime import datetime

class EncounterCreate(BaseModel):
    chief_complaint: str = ""
    hpi: str = ""
    exam: str = ""
    diagnosis: str = ""
    plan: str = ""
    va_od: str = ""
    va_os: str = ""
    iop_od: str = ""
    iop_os: str = ""

class EncounterOut(BaseModel):
    id: int
    patient_id: int
    created_at: datetime
    chief_complaint: str
    hpi: str
    exam: str
    diagnosis: str
    plan: str
    va_od: str
    va_os: str
    iop_od: str
    iop_os: str

    class Config:
        from_attributes = True
