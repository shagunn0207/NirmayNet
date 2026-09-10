from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.patient import PatientCreate, PatientOut, PatientUpdate
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase

router = APIRouter()

# Local in-memory store fallback for demo/testing when database is offline
_in_memory_patients: List[dict] = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "name": "Rekha Patil",
        "age": 28,
        "gender": "Female",
        "phone": "9823011234",
        "village": "Chinchpada",
        "abha_id": "91-8823-4410-12",
        "created_by": "00000000-0000-0000-0000-000000000001",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "name": "Sunita Kamble",
        "age": 34,
        "gender": "Female",
        "phone": "9421056789",
        "village": "Chinchpada",
        "abha_id": "91-3341-9920-55",
        "created_by": "00000000-0000-0000-0000-000000000001",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
]


@router.post("/", response_model=PatientOut, status_code=status.HTTP_201_CREATED, summary="Create new patient registration")
def create_patient(
    patient_in: PatientCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Register a new patient.
    Associates created_by with the authenticated user ID.
    """
    patient_id = uuid4()
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "id": str(patient_id),
        "name": patient_in.name,
        "age": patient_in.age,
        "gender": patient_in.gender,
        "phone": patient_in.phone,
        "village": patient_in.village,
        "abha_id": patient_in.abha_id,
        "allergies": patient_in.allergies,
        "created_by": str(current_user.id),
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    if supabase is not None:
        try:
            res = supabase.table("patients").insert({
                "id": str(patient_id),
                "name": patient_in.name,
                "age": patient_in.age,
                "gender": patient_in.gender,
                "phone": patient_in.phone,
                "village": patient_in.village,
                "abha_id": patient_in.abha_id,
                "allergies": patient_in.allergies,
                "created_by": str(current_user.id),
            }).execute()

            if res.data and len(res.data) > 0:
                p_data = res.data[0]
                return PatientOut(
                    id=UUID(p_data["id"]),
                    name=p_data["name"],
                    age=p_data["age"],
                    gender=p_data["gender"],
                    phone=p_data.get("phone"),
                    village=p_data["village"],
                    abha_id=p_data.get("abha_id"),
                    allergies=p_data.get("allergies"),
                    created_by=UUID(p_data["created_by"]) if p_data.get("created_by") else None,
                    created_at=p_data.get("created_at") or datetime.now(timezone.utc),
                    updated_at=p_data.get("updated_at") or datetime.now(timezone.utc),
                )
        except Exception as e:
            # Fallback to local record if Supabase is using placeholder credentials
            pass

    _in_memory_patients.insert(0, record)
    return PatientOut(
        id=patient_id,
        name=patient_in.name,
        age=patient_in.age,
        gender=patient_in.gender,
        phone=patient_in.phone,
        village=patient_in.village,
        abha_id=patient_in.abha_id,
        allergies=patient_in.allergies,
        created_by=current_user.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )


@router.get("/", response_model=List[PatientOut], summary="List registered patients")
def list_patients(
    village: Optional[str] = Query(None, description="Filter by village"),
    q: Optional[str] = Query(None, description="Search by name, phone, or ABHA ID"),
    current_user: UserOut = Depends(get_current_user),
):
    """
    Get registered patients.
    Supports filtering by village and search query (name / phone / ABHA ID).
    ASHA users see only patients created by themselves or unassigned legacy patients.
    HOSPITAL / DHO / ADMIN users access all patients for care continuity and reporting.
    """
    if supabase is not None:
        try:
            query = supabase.table("patients").select("*")

            # Scope patients for ASHA role users
            if current_user.role == UserRole.ASHA:
                query = query.or_(f"created_by.eq.{current_user.id},created_by.is.null")

            if village:
                query = query.eq("village", village)
            if q:
                query = query.or_(f"name.ilike.%{q}%,phone.ilike.%{q}%,abha_id.ilike.%{q}%")
            
            res = query.order("created_at", desc=True).execute()
            if res.data is not None and len(res.data) > 0:
                results = []
                for p in res.data:
                    results.append(
                        PatientOut(
                            id=UUID(p["id"]),
                            name=p["name"],
                            age=p["age"],
                            gender=p["gender"],
                            phone=p.get("phone"),
                            village=p["village"],
                            abha_id=p.get("abha_id"),
                            allergies=p.get("allergies"),
                            created_by=UUID(p["created_by"]) if p.get("created_by") else None,
                            created_at=p.get("created_at") or datetime.now(timezone.utc),
                            updated_at=p.get("updated_at") or datetime.now(timezone.utc),
                        )
                    )
                return results
        except Exception as e:
            pass

    # Fallback to local list for demo/testing
    filtered = _in_memory_patients

    # Scope patients for ASHA role users in memory
    if current_user.role == UserRole.ASHA:
        filtered = [
            p for p in filtered
            if not p.get("created_by") or str(p.get("created_by")) == str(current_user.id)
        ]

    if village:
        filtered = [p for p in filtered if p["village"].lower() == village.lower()]
    if q:
        q_lower = q.lower()
        filtered = [
            p for p in filtered
            if q_lower in p["name"].lower() or (p.get("phone") and q_lower in p["phone"]) or (p.get("abha_id") and q_lower in p["abha_id"].lower())
        ]

    return [
        PatientOut(
            id=UUID(p["id"]),
            name=p["name"],
            age=p["age"],
            gender=p["gender"],
            phone=p.get("phone"),
            village=p["village"],
            abha_id=p.get("abha_id"),
            allergies=p.get("allergies"),
            created_by=UUID(p["created_by"]) if p.get("created_by") else None,
            created_at=p["created_at"],
            updated_at=p["updated_at"],
        )
        for p in filtered
    ]


@router.get("/{patient_id}", response_model=PatientOut, summary="Get details of a single patient")
def get_patient(
    patient_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieve single patient details by patient_id.
    Returns 404 if patient is not found.
    """
    if supabase is not None:
        try:
            res = supabase.table("patients").select("*").eq("id", str(patient_id)).execute()
            if res.data and len(res.data) > 0:
                p = res.data[0]
                return PatientOut(
                    id=UUID(p["id"]),
                    name=p["name"],
                    age=p["age"],
                    gender=p["gender"],
                    phone=p.get("phone"),
                    village=p["village"],
                    abha_id=p.get("abha_id"),
                    allergies=p.get("allergies"),
                    created_by=UUID(p["created_by"]) if p.get("created_by") else None,
                    created_at=p.get("created_at") or datetime.now(timezone.utc),
                    updated_at=p.get("updated_at") or datetime.now(timezone.utc),
                )
        except Exception:
            pass

    # Fallback to local memory list
    for p in _in_memory_patients:
        if str(p["id"]) == str(patient_id):
            return PatientOut(
                id=UUID(p["id"]),
                name=p["name"],
                age=p["age"],
                gender=p["gender"],
                phone=p.get("phone"),
                village=p["village"],
                abha_id=p.get("abha_id"),
                allergies=p.get("allergies"),
                created_by=UUID(p["created_by"]) if p.get("created_by") else None,
                created_at=p["created_at"],
                updated_at=p["updated_at"],
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Patient with ID '{patient_id}' not found",
    )


@router.patch("/{patient_id}", response_model=PatientOut, summary="Update patient information")
def update_patient(
    patient_id: UUID,
    patient_in: PatientUpdate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Update patient information by patient_id.
    Returns updated patient details.
    """
    update_fields = patient_in.model_dump(exclude_unset=True)
    if not update_fields:
        return get_patient(patient_id, current_user)

    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()

    if supabase is not None:
        try:
            res = supabase.table("patients").update(update_fields).eq("id", str(patient_id)).execute()
            if res.data and len(res.data) > 0:
                p = res.data[0]
                return PatientOut(
                    id=UUID(p["id"]),
                    name=p["name"],
                    age=p["age"],
                    gender=p["gender"],
                    phone=p.get("phone"),
                    village=p["village"],
                    abha_id=p.get("abha_id"),
                    allergies=p.get("allergies"),
                    created_by=UUID(p["created_by"]) if p.get("created_by") else None,
                    created_at=p.get("created_at") or datetime.now(timezone.utc),
                    updated_at=p.get("updated_at") or datetime.now(timezone.utc),
                )
        except Exception:
            pass

    # Fallback to local memory update
    for idx, p in enumerate(_in_memory_patients):
        if str(p["id"]) == str(patient_id):
            updated_p = {**p, **update_fields}
            _in_memory_patients[idx] = updated_p
            return PatientOut(
                id=UUID(updated_p["id"]),
                name=updated_p["name"],
                age=updated_p["age"],
                gender=updated_p["gender"],
                phone=updated_p.get("phone"),
                village=updated_p["village"],
                abha_id=updated_p.get("abha_id"),
                allergies=updated_p.get("allergies"),
                created_by=UUID(updated_p["created_by"]) if updated_p.get("created_by") else None,
                created_at=updated_p["created_at"],
                updated_at=updated_p["updated_at"],
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Patient with ID '{patient_id}' not found",
    )
