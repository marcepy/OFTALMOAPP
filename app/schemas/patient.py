from pydantic import BaseModel
from datetime import date

class PatientCreate(BaseModel):
    national_id: str = ""
    first_name: str
    last_name: str
    birth_date: date | None = None
    phone: str = ""
    notes: str = ""

class PatientUpdate(BaseModel):
    national_id: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    birth_date: date | None = None
    phone: str | None = None
    notes: str | None = None

class PatientOut(BaseModel):
    id: int
    national_id: str
    first_name: str
    last_name: str
    birth_date: date | None
    phone: str
    notes: str

    class Config:
        from_attributes = True
