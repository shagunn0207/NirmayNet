from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class FollowupStatusEnum(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class FollowupUrgencyEnum(str, Enum):
    EMERGENCY = "EMERGENCY"
    URGENT = "URGENT"
    ROUTINE = "ROUTINE"


# ========================================================
# FOLLOWUP SCHEMAS
# ========================================================

class FollowupCreate(BaseModel):
    patient_id: UUID = Field(..., description="Patient UUID to schedule follow-up for")
    referral_id: Optional[UUID] = Field(None, description="Associated referral UUID if applicable")
    category: str = Field(..., min_length=1, max_length=100, example="ANC Care")
    urgency: FollowupUrgencyEnum = Field(FollowupUrgencyEnum.ROUTINE, description="Follow-up urgency level")
    followup_date: date = Field(..., description="Scheduled date for the follow-up (YYYY-MM-DD)")
    notes: Optional[str] = Field(None, example="Follow up on iron supplementation progress")


class FollowupStatusUpdate(BaseModel):
    status: FollowupStatusEnum = Field(..., description="New status for the follow-up")
    visited: Optional[bool] = Field(None, description="Whether the ASHA visited the patient")
    notes: Optional[str] = Field(None, description="Updated notes on this follow-up visit")


class FollowupOut(BaseModel):
    id: UUID
    patient_id: UUID
    referral_id: Optional[UUID] = None
    assigned_asha_id: Optional[UUID] = None
    category: str
    urgency: FollowupUrgencyEnum
    followup_date: date
    status: FollowupStatusEnum
    visited: bool
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
