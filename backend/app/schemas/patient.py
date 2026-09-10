from datetime import datetime
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, example="Rekha Patil")
    age: int = Field(..., ge=0, le=120, example=28)
    gender: Literal["Male", "Female", "Other"] = Field(..., example="Female")
    phone: Optional[str] = Field(None, example="9823011234")
    village: str = Field(..., min_length=1, max_length=100, example="Chinchpada")
    abha_id: Optional[str] = Field(None, example="91-8823-4410-12")
    allergies: Optional[str] = Field(None, example="Penicillin")


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    phone: Optional[str] = None
    village: Optional[str] = Field(None, min_length=1, max_length=100)
    abha_id: Optional[str] = None
    allergies: Optional[str] = None


class PatientOut(PatientBase):
    id: UUID
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
