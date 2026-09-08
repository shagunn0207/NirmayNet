from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.referral import (
    QueueItemOut, QueueDetailOut, ReferralOut, ReferralStatusEnum, ReferralStatusUpdate
)
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase
from app.api.v1.endpoints.referrals import (
    _in_memory_referrals, get_referral, update_referral_status, ALLOWED_TRANSITIONS
)
from app.api.v1.endpoints.patients import _in_memory_patients
from app.api.v1.endpoints.triage import _in_memory_triage_records
from app.api.v1.endpoints.dispatch import _in_memory_dispatch_logs
from app.api.v1.endpoints.teleconsult import _in_memory_teleconsultations

router = APIRouter()

# Urgency ordering for queue priority sort
TRIAGE_PRIORITY = {"EMERGENCY": 0, "URGENT": 1, "ROUTINE": 2, "": 3}


def _require_hospital_or_admin(current_user: UserOut):
    """Raises 403 if the user is not a HOSPITAL or ADMIN role."""
    if current_user.role not in (UserRole.HOSPITAL, UserRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HOSPITAL or ADMIN users can perform this action",
        )


def _lookup_patient(patient_id: str) -> Optional[dict]:
    """Returns patient dict from in-memory store by string id."""
    for p in _in_memory_patients:
        if str(p["id"]) == patient_id:
            return p
    return None


def _lookup_triage(triage_id: Optional[str]) -> Optional[dict]:
    """Returns latest triage record for a triage_id."""
    if not triage_id:
        return None
    for t in _in_memory_triage_records:
        if str(t["id"]) == triage_id:
            return t
    return None


def _lookup_triage_by_patient(patient_id: str) -> Optional[dict]:
    """Returns latest triage record for a patient_id (fallback when no triage_record_id on referral)."""
    for t in _in_memory_triage_records:
        if str(t["patient_id"]) == patient_id:
            return t
    return None


def _build_queue_item(r: dict) -> Optional[QueueItemOut]:
    """Builds a QueueItemOut from an in-memory referral dict plus lookups."""
    patient = _lookup_patient(r["patient_id"])
    if not patient:
        return None

    triage = _lookup_triage(r.get("triage_record_id")) or _lookup_triage_by_patient(r["patient_id"])

    has_dispatch = any(str(d["referral_id"]) == str(r["id"]) for d in _in_memory_dispatch_logs)
    has_teleconsult = any(str(tc.get("referral_id", "")) == str(r["id"]) for tc in _in_memory_teleconsultations)

    # Parse created_at safely
    created_at_raw = r.get("created_at") or datetime.now(timezone.utc).isoformat()
    if isinstance(created_at_raw, str):
        try:
            created_at = datetime.fromisoformat(created_at_raw.replace("Z", "+00:00"))
        except Exception:
            created_at = datetime.now(timezone.utc)
    else:
        created_at = created_at_raw

    # Parse arrived_at safely
    arrived_at = None
    arrived_at_raw = r.get("arrived_at")
    if arrived_at_raw:
        if isinstance(arrived_at_raw, str):
            try:
                arrived_at = datetime.fromisoformat(arrived_at_raw.replace("Z", "+00:00"))
            except Exception:
                arrived_at = None
        else:
            arrived_at = arrived_at_raw

    return QueueItemOut(
        referral_id=UUID(r["id"]),
        referral_code=r.get("referral_code"),
        referral_status=ReferralStatusEnum(r["status"]),
        referral_reason=r.get("reason"),
        destination_hospital=r["destination_hospital"],
        arrived_at=arrived_at,
        referral_created_at=created_at,
        patient_id=UUID(patient["id"]),
        patient_name=patient["name"],
        patient_age=patient["age"],
        patient_gender=patient["gender"],
        patient_village=patient["village"],
        triage_id=UUID(triage["id"]) if triage else None,
        triage_category=triage["triage_category"] if triage else None,
        triage_score=triage["triage_score"] if triage else None,
        has_dispatch=has_dispatch,
        has_teleconsult=has_teleconsult,
    )


@router.get("/hospital", response_model=List[QueueItemOut], summary="Get hospital referral queue ordered by urgency")
def get_hospital_queue(
    current_user: UserOut = Depends(get_current_user),
):
    """
    Returns all active referrals for the hospital queue, enriched with patient and triage details.
    Ordered by: EMERGENCY → URGENT → ROUTINE, then oldest first within same priority.
    HOSPITAL sees only their facility's referrals; ADMIN/DHO sees all.
    """
    # Try Supabase first — falls back to in-memory for prototype
    referrals_raw = _in_memory_referrals

    # Role-based filtering
    if current_user.role == UserRole.HOSPITAL and current_user.facility_name:
        referrals_raw = [
            r for r in referrals_raw
            if r.get("destination_hospital", "").lower() == current_user.facility_name.lower()
        ]

    # Build enriched items
    items: List[QueueItemOut] = []
    for r in referrals_raw:
        # Skip terminal states for active queue view
        if r["status"] in ("COMPLETED", "CANCELLED"):
            continue
        item = _build_queue_item(r)
        if item:
            items.append(item)

    # Sort: urgency first (EMERGENCY=0, URGENT=1, ROUTINE=2, unknown=3), then oldest first
    items.sort(key=lambda x: (
        TRIAGE_PRIORITY.get(x.triage_category or "", 3),
        x.referral_created_at,
    ))

    return items


@router.post("/{referral_id}/arrive", response_model=ReferralOut, summary="Confirm patient arrival at hospital")
def confirm_arrival(
    referral_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Records that a referred patient has arrived at the destination hospital.
    Transitions referral status from PENDING or DISPATCHED → CONFIRMED_ARRIVAL.
    Records arrival timestamp in referrals.arrived_at.
    Only HOSPITAL or ADMIN users may call this endpoint.
    """
    _require_hospital_or_admin(current_user)

    referral = get_referral(referral_id, current_user)

    if referral.status == ReferralStatusEnum.CONFIRMED_ARRIVAL:
        return referral  # already confirmed, idempotent

    if referral.status not in (ReferralStatusEnum.PENDING, ReferralStatusEnum.DISPATCHED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot confirm arrival for referral with status '{referral.status.value}'. "
                   f"Referral must be PENDING or DISPATCHED.",
        )

    now_iso = datetime.now(timezone.utc).isoformat()

    # Update Supabase
    if supabase is not None:
        try:
            res = supabase.table("referrals").update({
                "status": ReferralStatusEnum.CONFIRMED_ARRIVAL.value,
                "arrived_at": now_iso,
                "updated_at": now_iso,
            }).eq("id", str(referral_id)).execute()

            if res.data and len(res.data) > 0:
                ref = res.data[0]
                return ReferralOut(
                    id=UUID(ref["id"]),
                    referral_code=ref.get("referral_code"),
                    patient_id=UUID(ref["patient_id"]),
                    triage_record_id=UUID(ref["triage_record_id"]) if ref.get("triage_record_id") else None,
                    referring_user_id=UUID(ref["referring_user_id"]) if ref.get("referring_user_id") else None,
                    destination_hospital=ref["destination_hospital"],
                    reason=ref.get("reason"),
                    status=ReferralStatusEnum(ref["status"]),
                    arrived_at=ref.get("arrived_at"),
                    created_at=ref.get("created_at") or datetime.now(timezone.utc),
                    updated_at=ref.get("updated_at") or datetime.now(timezone.utc),
                )
        except Exception:
            pass

    # Fallback in-memory
    for r in _in_memory_referrals:
        if str(r["id"]) == str(referral_id):
            r["status"] = ReferralStatusEnum.CONFIRMED_ARRIVAL.value
            r["arrived_at"] = now_iso
            r["updated_at"] = now_iso
            return ReferralOut(
                id=UUID(r["id"]),
                referral_code=r.get("referral_code"),
                patient_id=UUID(r["patient_id"]),
                triage_record_id=UUID(r["triage_record_id"]) if r.get("triage_record_id") else None,
                referring_user_id=UUID(r["referring_user_id"]) if r.get("referring_user_id") else None,
                destination_hospital=r["destination_hospital"],
                reason=r.get("reason"),
                status=ReferralStatusEnum(r["status"]),
                arrived_at=r.get("arrived_at"),
                created_at=r["created_at"],
                updated_at=r["updated_at"],
            )

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Referral '{referral_id}' not found")


@router.post("/{referral_id}/consult", response_model=ReferralOut, summary="Mark patient as entering consultation")
def start_consultation(
    referral_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Transitions referral from CONFIRMED_ARRIVAL → IN_CONSULTATION.
    Only HOSPITAL or ADMIN users may call this endpoint.
    """
    _require_hospital_or_admin(current_user)

    referral = get_referral(referral_id, current_user)

    if referral.status != ReferralStatusEnum.CONFIRMED_ARRIVAL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot start consultation: referral must be in CONFIRMED_ARRIVAL state, "
                   f"currently '{referral.status.value}'.",
        )

    return update_referral_status(
        referral_id,
        ReferralStatusUpdate(status=ReferralStatusEnum.IN_CONSULTATION),
        current_user,
    )


@router.post("/{referral_id}/complete", response_model=ReferralOut, summary="Mark referral as completed")
def complete_referral(
    referral_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Transitions referral from IN_CONSULTATION → COMPLETED.
    Only HOSPITAL or ADMIN users may call this endpoint.
    """
    _require_hospital_or_admin(current_user)

    referral = get_referral(referral_id, current_user)

    if referral.status != ReferralStatusEnum.IN_CONSULTATION:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot complete referral: must be IN_CONSULTATION, "
                   f"currently '{referral.status.value}'.",
        )

    return update_referral_status(
        referral_id,
        ReferralStatusUpdate(status=ReferralStatusEnum.COMPLETED),
        current_user,
    )


@router.get("/{referral_id}", response_model=QueueDetailOut, summary="Get full referral card detail for hospital view")
def get_queue_detail(
    referral_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Returns complete referral detail view including patient info, triage assessment,
    dispatch log, and teleconsultation session data. Powers the hospital referral card UI.
    """
    referral = get_referral(referral_id, current_user)

    # Patient lookup
    patient_data: Optional[dict] = None
    for p in _in_memory_patients:
        if str(p["id"]) == str(referral.patient_id):
            patient_data = dict(p)
            break
    if not patient_data:
        patient_data = {"id": str(referral.patient_id), "name": "Unknown"}

    # Triage lookup
    triage_data: Optional[dict] = None
    if referral.triage_record_id:
        for t in _in_memory_triage_records:
            if str(t["id"]) == str(referral.triage_record_id):
                triage_data = dict(t)
                break
    if not triage_data:
        for t in _in_memory_triage_records:
            if str(t["patient_id"]) == str(referral.patient_id):
                triage_data = dict(t)
                break

    # Dispatch lookup
    dispatch_data: Optional[dict] = None
    for d in _in_memory_dispatch_logs:
        if str(d["referral_id"]) == str(referral_id):
            dispatch_data = dict(d)
            break

    # Teleconsult lookup
    teleconsult_data: Optional[dict] = None
    for tc in _in_memory_teleconsultations:
        if str(tc.get("referral_id", "")) == str(referral_id):
            teleconsult_data = dict(tc)
            break

    return QueueDetailOut(
        referral=referral,
        patient=patient_data,
        triage=triage_data,
        dispatch=dispatch_data,
        teleconsult=teleconsult_data,
    )
