from datetime import datetime
from typing import List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class TriageAssessRequest(BaseModel):
    patient_id: UUID = Field(..., description="Target patient UUID")
    symptoms: List[str] = Field(..., min_items=1, description="List of observed symptoms/risk factors")


class TriageAssessResponse(BaseModel):
    patient_id: UUID
    symptoms: List[str]
    triage_score: int
    triage_category: Literal["EMERGENCY", "URGENT", "ROUTINE"]
    reason: str


class TriageRecordOut(BaseModel):
    id: UUID
    patient_id: UUID
    symptoms: List[str]
    triage_score: int
    triage_category: Literal["EMERGENCY", "URGENT", "ROUTINE"]
    reason: Optional[str] = None
    created_by: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ========================================================
# OFFLINE SYNC SCHEMAS
# ========================================================

class OfflinePatientSyncItem(BaseModel):
    id: UUID
    name: str
    age: int = Field(..., ge=0, le=120)
    gender: Literal["Male", "Female", "Other"]
    phone: Optional[str] = None
    village: str
    abha_id: Optional[str] = None
    created_at: Optional[datetime] = None


class OfflineTriageSyncItem(BaseModel):
    id: UUID
    patient_id: UUID
    symptoms: List[str]
    triage_score: Optional[int] = None
    triage_category: Optional[Literal["EMERGENCY", "URGENT", "ROUTINE"]] = None
    reason: Optional[str] = None
    created_at: Optional[datetime] = None


class SyncBatchRequest(BaseModel):
    patients: List[OfflinePatientSyncItem] = Field(default_factory=list)
    triage_records: List[OfflineTriageSyncItem] = Field(default_factory=list)


class SyncItemStatus(BaseModel):
    id: UUID
    item_type: Literal["patient", "triage_record"]
    status: Literal["created", "already_existed", "failed"]
    message: str


class SyncBatchResponse(BaseModel):
    synced_count: int
    failed_count: int
    results: List[SyncItemStatus]
