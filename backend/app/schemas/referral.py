from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ReferralStatusEnum(str, Enum):
    PENDING = "PENDING"
    DISPATCHED = "DISPATCHED"
    CONFIRMED_ARRIVAL = "CONFIRMED_ARRIVAL"
    IN_CONSULTATION = "IN_CONSULTATION"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class DispatchStatusEnum(str, Enum):
    REQUESTED = "REQUESTED"
    DISPATCHED = "DISPATCHED"
    EN_ROUTE = "EN_ROUTE"
    ARRIVED = "ARRIVED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class TeleconsultStatusEnum(str, Enum):
    SCHEDULED = "SCHEDULED"
    CONNECTING = "CONNECTING"
    CONNECTED = "CONNECTED"
    COMPLETED = "COMPLETED"
    SIGNAL_LOST = "SIGNAL_LOST"
    CANCELLED = "CANCELLED"


# ========================================================
# REFERRAL SCHEMAS
# ========================================================

class ReferralCreate(BaseModel):
    patient_id: UUID = Field(..., description="Target patient UUID")
    triage_record_id: Optional[UUID] = Field(None, description="Associated triage assessment UUID")
    destination_hospital: str = Field(..., min_length=1, example="District Hospital Nandurbar")
    reason: Optional[str] = Field(None, example="High-risk ANC pregnancy with dyspnea requiring urgent OB/GYN evaluation")


class ReferralStatusUpdate(BaseModel):
    status: ReferralStatusEnum = Field(..., description="Target status transition")


class ReferralOut(BaseModel):
    id: UUID
    referral_code: Optional[str] = None
    patient_id: UUID
    triage_record_id: Optional[UUID] = None
    referring_user_id: Optional[UUID] = None
    destination_hospital: str
    reason: Optional[str] = None
    status: ReferralStatusEnum
    arrived_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ========================================================
# DISPATCH SCHEMAS
# ========================================================

class DispatchCreate(BaseModel):
    referral_id: UUID = Field(..., description="Referral UUID to request 108 ambulance for")


class DispatchOut(BaseModel):
    id: UUID
    referral_id: UUID
    vehicle_number: Optional[str] = "MH-39-A-1080"
    driver_name: Optional[str] = "Ramesh Shinde"
    driver_phone: Optional[str] = "9822108108"
    eta_minutes: Optional[int] = 12
    status: DispatchStatusEnum = DispatchStatusEnum.DISPATCHED
    requested_at: datetime
    updated_at: datetime
    simulation: bool = True
    message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ========================================================
# TELECONSULTATION SCHEMAS
# ========================================================

class TeleconsultRoomCreate(BaseModel):
    patient_id: UUID = Field(..., description="Target patient UUID")
    referral_id: Optional[UUID] = Field(None, description="Associated referral UUID if applicable")
    notes: Optional[str] = Field(None, example="Urgent teleconsultation for pre-referral stabilization")


class TeleconsultOut(BaseModel):
    id: UUID
    patient_id: UUID
    referral_id: Optional[UUID] = None
    doctor_id: Optional[UUID] = None
    room_id: str
    jitsi_url: str
    status: TeleconsultStatusEnum = TeleconsultStatusEnum.SCHEDULED
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ========================================================
# QUEUE SCHEMAS
# ========================================================

class QueueItemOut(BaseModel):
    """Enriched queue item combining referral + patient + triage data."""
    referral_id: UUID
    referral_code: Optional[str] = None
    referral_status: ReferralStatusEnum
    referral_reason: Optional[str] = None
    destination_hospital: str
    arrived_at: Optional[datetime] = None
    referral_created_at: datetime
    # Patient fields
    patient_id: UUID
    patient_name: str
    patient_age: int
    patient_gender: str
    patient_village: str
    # Triage fields
    triage_id: Optional[UUID] = None
    triage_category: Optional[str] = None
    triage_score: Optional[int] = None
    # Dispatch / teleconsult presence flags
    has_dispatch: bool = False
    has_teleconsult: bool = False

    model_config = ConfigDict(from_attributes=True)


class QueueDetailOut(BaseModel):
    """Full referral card detail view for hospital UI."""
    referral: ReferralOut
    patient: dict
    triage: Optional[dict] = None
    dispatch: Optional[dict] = None
    teleconsult: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)


# ========================================================
# DHO METRICS SCHEMAS
# ========================================================

class DHOMetricsOut(BaseModel):
    total_referrals: int
    emergency_referrals: int
    urgent_referrals: int
    routine_referrals: int
    pending_referrals: int
    dispatched_referrals: int
    confirmed_arrivals: int
    in_consultation: int
    completed_referrals: int
    cancelled_referrals: int
    total_patients: int
    total_triage_assessments: int
    completion_rate: float
    # Breakdowns
    referrals_by_village: dict
    referrals_by_hospital: dict
    referrals_by_triage_category: dict
