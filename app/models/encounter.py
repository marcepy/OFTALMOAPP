from sqlalchemy import ForeignKey, DateTime, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class Encounter(Base):
    __tablename__ = "encounters"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    chief_complaint: Mapped[str] = mapped_column(String(255), default="")
    hpi: Mapped[str] = mapped_column(Text, default="")
    exam: Mapped[str] = mapped_column(Text, default="")
    diagnosis: Mapped[str] = mapped_column(Text, default="")
    plan: Mapped[str] = mapped_column(Text, default="")

    va_od: Mapped[str] = mapped_column(String(50), default="")
    va_os: Mapped[str] = mapped_column(String(50), default="")
    iop_od: Mapped[str] = mapped_column(String(50), default="")
    iop_os: Mapped[str] = mapped_column(String(50), default="")

    patient = relationship("Patient", back_populates="encounters")
