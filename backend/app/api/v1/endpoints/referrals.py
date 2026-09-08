import random
from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.referral import ReferralCreate, ReferralOut, ReferralStatusEnum, ReferralStatusUpdate
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase
from app.api.v1.endpoints.patients import get_patient
from app.api.v1.endpoints.triage import _in_memory_triage_records

router = APIRouter()

# Local in-memory store fallback for referrals
_in_memory_referrals: List[dict] = []

# Allowed status transitions rule map
ALLOWED_TRANSITIONS = {
    ReferralStatusEnum.PENDING: {
        ReferralStatusEnum.DISPATCHED,
        ReferralStatusEnum.CONFIRMED_ARRIVAL,
        ReferralStatusEnum.CANCELLED,
    },
    ReferralStatusEnum.DISPATCHED: {
        ReferralStatusEnum.CONFIRMED_ARRIVAL,
        ReferralStatusEnum.CANCELLED,
    },
    ReferralStatusEnum.CONFIRMED_ARRIVAL: {
        ReferralStatusEnum.IN_CONSULTATION,
        ReferralStatusEnum.COMPLETED,
        ReferralStatusEnum.CANCELLED,
    },
    ReferralStatusEnum.IN_CONSULTATION: {
        ReferralStatusEnum.COMPLETED,
        ReferralStatusEnum.CANCELLED,
    },
    ReferralStatusEnum.COMPLETED: set(),
    ReferralStatusEnum.CANCELLED: set(),
}


def _generate_referral_code() -> str:
    """Generates a human-readable referral tracking code, e.g. NMN-2026-8419"""
    rand_num = random.randint(1000, 9999)
    year = datetime.now().year
    return f"NMN-{year}-{rand_num}"


@router.post("/", response_model=ReferralOut, status_code=status.HTTP_201_CREATED, summary="Create a new hospital referral")
def create_referral(
    referral_in: ReferralCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Creates a new referral to a PHC or District Hospital.
    Validates patient and triage record existence before creation.
    """
    # 1. Validate patient existence
    get_patient(referral_in.patient_id, current_user)

    # 2. Validate triage record existence & ownership if supplied
    if referral_in.triage_record_id:
        triage_found = False
        t_patient_id = None

        if supabase is not None:
            try:
                res = supabase.table("triage_records").select("*").eq("id", str(referral_in.triage_record_id)).execute()
                if res.data and len(res.data) > 0:
                    triage_found = True
                    t_patient_id = res.data[0]["patient_id"]
            except Exception:
                pass

        if not triage_found:
            for t in _in_memory_triage_records:
                if str(t["id"]) == str(referral_in.triage_record_id):
                    triage_found = True
                    t_patient_id = str(t["patient_id"])
                    break

        if not triage_found:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Triage record with ID '{referral_in.triage_record_id}' not found",
            )

        if t_patient_id and str(t_patient_id) != str(referral_in.patient_id):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Triage record does not belong to the specified patient",
            )

    referral_id = uuid4()
    referral_code = _generate_referral_code()
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "id": str(referral_id),
        "referral_code": referral_code,
        "patient_id": str(referral_in.patient_id),
        "triage_record_id": str(referral_in.triage_record_id) if referral_in.triage_record_id else None,
        "referring_user_id": str(current_user.id),
        "destination_hospital": referral_in.destination_hospital,
        "reason": referral_in.reason,
        "status": ReferralStatusEnum.PENDING.value,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    if supabase is not None:
        try:
            res = supabase.table("referrals").insert({
                "id": str(referral_id),
                "referral_code": referral_code,
                "patient_id": str(referral_in.patient_id),
                "triage_record_id": str(referral_in.triage_record_id) if referral_in.triage_record_id else None,
                "referring_user_id": str(current_user.id),
                "destination_hospital": referral_in.destination_hospital,
                "reason": referral_in.reason,
                "status": ReferralStatusEnum.PENDING.value,
            }).execute()

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

    _in_memory_referrals.insert(0, record)

    return ReferralOut(
        id=referral_id,
        referral_code=referral_code,
        patient_id=referral_in.patient_id,
        triage_record_id=referral_in.triage_record_id,
        referring_user_id=current_user.id,
        destination_hospital=referral_in.destination_hospital,
        reason=referral_in.reason,
        status=ReferralStatusEnum.PENDING,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )


@router.get("/", response_model=List[ReferralOut], summary="List referrals with role-based filtering")
def list_referrals(
    status_filter: Optional[ReferralStatusEnum] = Query(None, alias="status", description="Filter by status"),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient UUID"),
    destination_hospital: Optional[str] = Query(None, description="Filter by destination hospital"),
    current_user: UserOut = Depends(get_current_user),
):
    """
    List referrals. Supports role-based access control and filtering:
    - ASHA: sees referrals created by themselves.
    - HOSPITAL: sees referrals targeting their hospital facility.
    - DHO / ADMIN: sees all system referrals.
    """
    if supabase is not None:
        try:
            query = supabase.table("referrals").select("*")
            
            if current_user.role == UserRole.ASHA:
                query = query.eq("referring_user_id", str(current_user.id))
            elif current_user.role == UserRole.HOSPITAL and current_user.facility_name:
                query = query.eq("destination_hospital", current_user.facility_name)

            if status_filter:
                query = query.eq("status", status_filter.value)
            if patient_id:
                query = query.eq("patient_id", str(patient_id))
            if destination_hospital:
                query = query.ilike("destination_hospital", f"%{destination_hospital}%")

            res = query.order("created_at", desc=True).execute()
            if res.data is not None and len(res.data) > 0:
                results = []
                for ref in res.data:
                    results.append(
                        ReferralOut(
                            id=UUID(ref["id"]),
                            referral_code=ref.get("referral_code"),
                            patient_id=UUID(ref["patient_id"]),
                            triage_record_id=UUID(ref["triage_record_id"]) if ref.get("triage_record_id") else None,
                            referring_user_id=UUID(ref["referring_user_id"]) if ref.get("referring_user_id") else None,
                            destination_hospital=ref["destination_hospital"],
                            reason=ref.get("reason"),
                            status=ReferralStatusEnum(ref["status"]),
                            created_at=ref.get("created_at") or datetime.now(timezone.utc),
                            updated_at=ref.get("updated_at") or datetime.now(timezone.utc),
                        )
                    )
                return results
        except Exception:
            pass

    # Fallback to local memory list
    filtered = _in_memory_referrals

    if current_user.role == UserRole.ASHA:
        filtered = [r for r in filtered if r.get("referring_user_id") == str(current_user.id)]
    elif current_user.role == UserRole.HOSPITAL and current_user.facility_name:
        filtered = [r for r in filtered if r.get("destination_hospital", "").lower() == current_user.facility_name.lower()]

    if status_filter:
        filtered = [r for r in filtered if r["status"] == status_filter.value]
    if patient_id:
        filtered = [r for r in filtered if r["patient_id"] == str(patient_id)]
    if destination_hospital:
        dh_lower = destination_hospital.lower()
        filtered = [r for r in filtered if dh_lower in r.get("destination_hospital", "").lower()]

    return [
        ReferralOut(
            id=UUID(r["id"]),
            referral_code=r.get("referral_code"),
            patient_id=UUID(r["patient_id"]),
            triage_record_id=UUID(r["triage_record_id"]) if r.get("triage_record_id") else None,
            referring_user_id=UUID(r["referring_user_id"]) if r.get("referring_user_id") else None,
            destination_hospital=r["destination_hospital"],
            reason=r.get("reason"),
            status=ReferralStatusEnum(r["status"]),
            created_at=r["created_at"],
            updated_at=r["updated_at"],
        )
        for r in filtered
    ]


@router.get("/{referral_id}", response_model=ReferralOut, summary="Get details of a single referral")
def get_referral(
    referral_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieve single referral details by referral_id.
    Returns 404 if not found.
    """
    if supabase is not None:
        try:
            res = supabase.table("referrals").select("*").eq("id", str(referral_id)).execute()
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

    for r in _in_memory_referrals:
        if str(r["id"]) == str(referral_id):
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

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Referral with ID '{referral_id}' not found",
    )


@router.patch("/{referral_id}/status", response_model=ReferralOut, summary="Update referral lifecycle status")
def update_referral_status(
    referral_id: UUID,
    status_update: ReferralStatusUpdate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Updates the referral status. Validates allowed status transitions.
    """
    current_referral = get_referral(referral_id, current_user)

    current_status = current_referral.status
    target_status = status_update.status

    if current_status == target_status:
        return current_referral

    allowed = ALLOWED_TRANSITIONS.get(current_status, set())
    if target_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from '{current_status.value}' to '{target_status.value}'. Allowed transitions: {[s.value for s in allowed]}",
        )

    now_iso = datetime.now(timezone.utc).isoformat()

    if supabase is not None:
        try:
            res = supabase.table("referrals").update({
                "status": target_status.value,
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

    for r in _in_memory_referrals:
        if str(r["id"]) == str(referral_id):
            r["status"] = target_status.value
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

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Referral with ID '{referral_id}' not found",
    )
