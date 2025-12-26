from sqlalchemy import String, Date, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True)
    national_id: Mapped[str] = mapped_column(String(50), index=True, default="")
    first_name: Mapped[str] = mapped_column(String(120))
    last_name: Mapped[str] = mapped_column(String(120))
    birth_date: Mapped[Date | None] = mapped_column(Date, nullable=True)
    phone: Mapped[str] = mapped_column(String(50), default="")
    notes: Mapped[str] = mapped_column(Text, default="")

    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete-orphan")
