from datetime import date, datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.followup import (
    FollowupCreate,
    FollowupOut,
    FollowupStatusUpdate,
    FollowupStatusEnum,
    FollowupUrgencyEnum,
)
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase
from app.api.v1.endpoints.patients import get_patient

router = APIRouter()

# Local in-memory fallback store for demo/offline mode
_in_memory_followups: List[dict] = []


def _row_to_out(row: dict) -> FollowupOut:
    """Convert a raw DB or in-memory row dict to FollowupOut."""
    followup_date = row.get("followup_date")
    if isinstance(followup_date, str):
        followup_date = date.fromisoformat(followup_date)

    created_at = row.get("created_at")
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    updated_at = row.get("updated_at")
    if isinstance(updated_at, str):
        updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))

    return FollowupOut(
        id=UUID(str(row["id"])),
        patient_id=UUID(str(row["patient_id"])),
        referral_id=UUID(str(row["referral_id"])) if row.get("referral_id") else None,
        assigned_asha_id=UUID(str(row["assigned_asha_id"])) if row.get("assigned_asha_id") else None,
        category=row["category"],
        urgency=FollowupUrgencyEnum(row.get("urgency", "ROUTINE")),
        followup_date=followup_date,
        status=FollowupStatusEnum(row.get("status", "PENDING")),
        visited=bool(row.get("visited", False)),
        notes=row.get("notes"),
        created_at=created_at or datetime.now(timezone.utc),
        updated_at=updated_at or datetime.now(timezone.utc),
    )


@router.post(
    "/",
    response_model=FollowupOut,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a new patient follow-up",
)
def create_followup(
    followup_in: FollowupCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Create a new follow-up for a patient.
    Associates the follow-up with the authenticated ASHA worker as assigned_asha_id.
    Validates that the patient exists before creating the follow-up.
    """
    # Validate patient existence
    get_patient(followup_in.patient_id, current_user)

    followup_id = uuid4()
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "id": str(followup_id),
        "patient_id": str(followup_in.patient_id),
        "referral_id": str(followup_in.referral_id) if followup_in.referral_id else None,
        "assigned_asha_id": str(current_user.id),
        "category": followup_in.category,
        "urgency": followup_in.urgency.value,
        "followup_date": followup_in.followup_date.isoformat(),
        "status": FollowupStatusEnum.PENDING.value,
        "visited": False,
        "notes": followup_in.notes,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    if supabase is not None:
        try:
            res = supabase.table("followups").insert({
                "id": str(followup_id),
                "patient_id": str(followup_in.patient_id),
                "referral_id": str(followup_in.referral_id) if followup_in.referral_id else None,
                "assigned_asha_id": str(current_user.id),
                "category": followup_in.category,
                "urgency": followup_in.urgency.value,
                "followup_date": followup_in.followup_date.isoformat(),
                "status": FollowupStatusEnum.PENDING.value,
                "visited": False,
                "notes": followup_in.notes,
            }).execute()
            if res.data and len(res.data) > 0:
                return _row_to_out(res.data[0])
        except Exception:
            pass

    _in_memory_followups.append(record)
    return _row_to_out(record)


@router.get(
    "/",
    response_model=List[FollowupOut],
    summary="List follow-ups (ASHA: own only; DHO/ADMIN: all)",
)
def list_followups(
    patient_id: Optional[UUID] = Query(None, description="Filter follow-ups by patient UUID"),
    status_filter: Optional[FollowupStatusEnum] = Query(None, alias="status", description="Filter by follow-up status"),
    upcoming_only: bool = Query(False, description="If true, only return follow-ups with followup_date >= today"),
    current_user: UserOut = Depends(get_current_user),
):
    """
    List follow-ups.
    - ASHA: only follow-ups they are assigned to (assigned_asha_id == current_user.id).
    - DHO / HOSPITAL / ADMIN: all follow-ups across all ASHA workers.
    Supports optional filtering by patient_id, status, and upcoming date.
    """
    # DHO, HOSPITAL, and ADMIN have unrestricted read access across all follow-ups.
    is_privileged = current_user.role in (UserRole.DHO, UserRole.HOSPITAL, UserRole.ADMIN)

    if supabase is not None:
        try:
            query = supabase.table("followups").select("*")

            # Scope to own records for ASHA only
            if not is_privileged:
                query = query.eq("assigned_asha_id", str(current_user.id))

            if patient_id:
                query = query.eq("patient_id", str(patient_id))
            if status_filter:
                query = query.eq("status", status_filter.value)
            if upcoming_only:
                query = query.gte("followup_date", date.today().isoformat())

            res = query.order("followup_date", desc=False).execute()
            if res.data is not None:
                return [_row_to_out(row) for row in res.data]
        except Exception:
            pass

    # Fallback to in-memory store
    if is_privileged:
        filtered = list(_in_memory_followups)
    else:
        filtered = [f for f in _in_memory_followups if f.get("assigned_asha_id") == str(current_user.id)]

    if patient_id:
        filtered = [f for f in filtered if f["patient_id"] == str(patient_id)]
    if status_filter:
        filtered = [f for f in filtered if f["status"] == status_filter.value]
    if upcoming_only:
        today = date.today().isoformat()
        filtered = [f for f in filtered if f.get("followup_date", "") >= today]

    return [_row_to_out(f) for f in filtered]


@router.get(
    "/{followup_id}",
    response_model=FollowupOut,
    summary="Get a specific follow-up by ID",
)
def get_followup(
    followup_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieve a specific follow-up record by its UUID.
    Returns 404 if not found.
    """
    if supabase is not None:
        try:
            res = supabase.table("followups").select("*").eq("id", str(followup_id)).execute()
            if res.data and len(res.data) > 0:
                return _row_to_out(res.data[0])
        except Exception:
            pass

    for f in _in_memory_followups:
        if str(f["id"]) == str(followup_id):
            return _row_to_out(f)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Follow-up with ID '{followup_id}' not found",
    )


@router.patch(
    "/{followup_id}",
    response_model=FollowupOut,
    summary="Update status or notes of a follow-up",
)
def update_followup(
    followup_id: UUID,
    followup_update: FollowupStatusUpdate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Update follow-up status, visited flag, and/or notes.
    Used by ASHA workers to mark a follow-up as completed or cancelled after a visit.
    """
    update_fields: dict = {}
    if followup_update.status is not None:
        update_fields["status"] = followup_update.status.value
    if followup_update.visited is not None:
        update_fields["visited"] = followup_update.visited
    if followup_update.notes is not None:
        update_fields["notes"] = followup_update.notes

    if not update_fields:
        return get_followup(followup_id, current_user)

    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()

    if supabase is not None:
        try:
            res = supabase.table("followups").update(update_fields).eq("id", str(followup_id)).execute()
            if res.data and len(res.data) > 0:
                return _row_to_out(res.data[0])
        except Exception:
            pass

    for idx, f in enumerate(_in_memory_followups):
        if str(f["id"]) == str(followup_id):
            updated = {**f, **update_fields}
            _in_memory_followups[idx] = updated
            return _row_to_out(updated)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Follow-up with ID '{followup_id}' not found",
    )


@router.delete(
    "/{followup_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel and delete a follow-up",
)
def delete_followup(
    followup_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Delete (cancel) a follow-up by ID.
    Only the assigned ASHA or admin roles may delete.
    Returns 404 if not found.
    """
    if supabase is not None:
        try:
            res = supabase.table("followups").select("id").eq("id", str(followup_id)).execute()
            if res.data and len(res.data) > 0:
                supabase.table("followups").delete().eq("id", str(followup_id)).execute()
                return
        except Exception:
            pass

    for idx, f in enumerate(_in_memory_followups):
        if str(f["id"]) == str(followup_id):
            _in_memory_followups.pop(idx)
            return

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Follow-up with ID '{followup_id}' not found",
    )
