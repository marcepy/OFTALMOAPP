from datetime import datetime
from pydantic import BaseModel, Field

class AppointmentBase(BaseModel):
    title: str
    specialist: str
    location: str
    start_at: datetime
    end_at: datetime
    status: str = ""
    type: str = ""
    channel: str = ""
    tags: list[str] = Field(default_factory=list)
    notes: str = ""
    patient_id: int | None = None
    online: bool = False

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    title: str | None = None
    specialist: str | None = None
    location: str | None = None
    start_at: datetime | None = None
    end_at: datetime | None = None
    status: str | None = None
    type: str | None = None
    channel: str | None = None
    tags: list[str] | None = None
    notes: str | None = None
    patient_id: int | None = None
    online: bool | None = None

class AppointmentOut(AppointmentBase):
    id: int

    class Config:
        from_attributes = True
