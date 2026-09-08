from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.referral import TeleconsultOut, TeleconsultRoomCreate, TeleconsultStatusEnum
from app.schemas.auth import UserOut
from app.api.deps import get_current_user
from app.services.jitsi import generate_jitsi_room
from app.services.supabase_client import supabase
from app.api.v1.endpoints.patients import get_patient

router = APIRouter()

# Local in-memory store fallback for teleconsultations
_in_memory_teleconsultations: List[dict] = []


@router.post("/room", response_model=TeleconsultOut, status_code=status.HTTP_201_CREATED, summary="Create a new Jitsi teleconsultation room")
def create_teleconsult_room(
    request: TeleconsultRoomCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Generates a new Jitsi Meet teleconsultation room for ASHA worker and PHC Doctor tele-triage.
    Validates patient existence and records session info.
    """
    # 1. Validate patient existence
    get_patient(request.patient_id, current_user)

    # 2. Generate Jitsi room details
    jitsi_info = generate_jitsi_room(request.patient_id, request.referral_id)

    consultation_id = uuid4()
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "id": str(consultation_id),
        "patient_id": str(request.patient_id),
        "referral_id": str(request.referral_id) if request.referral_id else None,
        "doctor_id": str(current_user.id) if current_user.role.value == "HOSPITAL" else None,
        "room_id": jitsi_info["room_id"],
        "jitsi_url": jitsi_info["jitsi_url"],
        "status": TeleconsultStatusEnum.SCHEDULED.value,
        "notes": request.notes,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    if supabase is not None:
        try:
            res = supabase.table("teleconsultations").insert({
                "id": str(consultation_id),
                "patient_id": str(request.patient_id),
                "referral_id": str(request.referral_id) if request.referral_id else None,
                "doctor_id": str(current_user.id) if current_user.role.value == "HOSPITAL" else None,
                "room_id": jitsi_info["room_id"],
                "status": TeleconsultStatusEnum.SCHEDULED.value,
                "notes": request.notes,
            }).execute()

            if res.data and len(res.data) > 0:
                tc = res.data[0]
                return TeleconsultOut(
                    id=UUID(tc["id"]),
                    patient_id=UUID(tc["patient_id"]),
                    referral_id=UUID(tc["referral_id"]) if tc.get("referral_id") else None,
                    doctor_id=UUID(tc["doctor_id"]) if tc.get("doctor_id") else None,
                    room_id=tc["room_id"],
                    jitsi_url=f"https://meet.jit.si/{tc['room_id']}",
                    status=TeleconsultStatusEnum(tc.get("status", "SCHEDULED")),
                    notes=tc.get("notes"),
                    created_at=tc.get("created_at") or datetime.now(timezone.utc),
                    updated_at=tc.get("updated_at") or datetime.now(timezone.utc),
                )
        except Exception:
            pass

    _in_memory_teleconsultations.insert(0, record)

    return TeleconsultOut(
        id=consultation_id,
        patient_id=request.patient_id,
        referral_id=request.referral_id,
        doctor_id=current_user.id if current_user.role.value == "HOSPITAL" else None,
        room_id=jitsi_info["room_id"],
        jitsi_url=jitsi_info["jitsi_url"],
        status=TeleconsultStatusEnum.SCHEDULED,
        notes=request.notes,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )


@router.get("/{consultation_id}", response_model=TeleconsultOut, summary="Get details of a teleconsultation session")
def get_teleconsult(
    consultation_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieve single teleconsultation session details by consultation_id.
    Returns 404 if not found.
    """
    if supabase is not None:
        try:
            res = supabase.table("teleconsultations").select("*").eq("id", str(consultation_id)).execute()
            if res.data and len(res.data) > 0:
                tc = res.data[0]
                return TeleconsultOut(
                    id=UUID(tc["id"]),
                    patient_id=UUID(tc["patient_id"]),
                    referral_id=UUID(tc["referral_id"]) if tc.get("referral_id") else None,
                    doctor_id=UUID(tc["doctor_id"]) if tc.get("doctor_id") else None,
                    room_id=tc["room_id"],
                    jitsi_url=f"https://meet.jit.si/{tc['room_id']}",
                    status=TeleconsultStatusEnum(tc.get("status", "SCHEDULED")),
                    notes=tc.get("notes"),
                    created_at=tc.get("created_at") or datetime.now(timezone.utc),
                    updated_at=tc.get("updated_at") or datetime.now(timezone.utc),
                )
        except Exception:
            pass

    for tc in _in_memory_teleconsultations:
        if str(tc["id"]) == str(consultation_id):
            return TeleconsultOut(
                id=UUID(tc["id"]),
                patient_id=UUID(tc["patient_id"]),
                referral_id=UUID(tc["referral_id"]) if tc.get("referral_id") else None,
                doctor_id=UUID(tc["doctor_id"]) if tc.get("doctor_id") else None,
                room_id=tc["room_id"],
                jitsi_url=tc["jitsi_url"],
                status=TeleconsultStatusEnum(tc["status"]),
                notes=tc.get("notes"),
                created_at=tc["created_at"],
                updated_at=tc["updated_at"],
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Teleconsultation with ID '{consultation_id}' not found",
    )
