from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class TaskUrgencyEnum(str, Enum):
    EMERGENCY = "EMERGENCY"
    URGENT = "URGENT"
    ROUTINE = "ROUTINE"


# ========================================================
# TASK SCHEMAS
# ========================================================

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, example="ANC Post-Discharge Visit")
    category: Optional[str] = Field("General", max_length=100, example="ANC Care")
    urgency: TaskUrgencyEnum = Field(TaskUrgencyEnum.ROUTINE, description="Task urgency level")


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, description="Updated task title")
    category: Optional[str] = Field(None, max_length=100, description="Updated task category")
    urgency: Optional[TaskUrgencyEnum] = Field(None, description="Updated task urgency level")
    visited: Optional[bool] = Field(None, description="Completion / visited status")


class TaskOut(BaseModel):
    id: UUID
    created_by: Optional[UUID] = None
    title: str
    category: str
    urgency: TaskUrgencyEnum
    visited: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
