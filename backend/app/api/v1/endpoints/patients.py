from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.patient import PatientCreate, PatientOut, PatientUpdate
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase

router = APIRouter()


# Local in-memory store fallback for demo/testing when database is unavailable.
# This is intentionally kept for offline/testing scenarios, but successful
# online requests must be persisted to Supabase.
_in_memory_patients: List[dict] = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "name": "Rekha Patil",
        "age": 28,
        "gender": "Female",
        "phone": "9823011234",
        "village": "Chinchpada",
        "abha_id": "91-8823-4410-12",
        "allergies": None,
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
        "allergies": None,
        "created_by": "00000000-0000-0000-0000-000000000001",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
]


def _patient_from_data(p: dict) -> PatientOut:
    """Convert a database/in-memory patient dictionary to PatientOut."""
    return PatientOut(
        id=UUID(str(p["id"])),
        name=p["name"],
        age=p["age"],
        gender=p["gender"],
        phone=p.get("phone"),
        village=p["village"],
        abha_id=p.get("abha_id"),
        allergies=p.get("allergies"),
        created_by=UUID(str(p["created_by"])) if p.get("created_by") else None,
        created_at=p.get("created_at") or datetime.now(timezone.utc),
        updated_at=p.get("updated_at") or datetime.now(timezone.utc),
    )


@router.post(
    "/",
    response_model=PatientOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create new patient registration",
)
def create_patient(
    patient_in: PatientCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Register a new patient.

    Online:
        Patient is persisted directly to Supabase.

    If Supabase is unavailable:
        The request fails with an HTTP 503 so the mobile client can
        detect the failure and place the operation in its offline queue.

    A successful online response is therefore always backed by a
    Supabase database record.
    """

    patient_id = uuid4()
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    insert_data = {
        "id": str(patient_id),
        "name": patient_in.name,
        "age": patient_in.age,
        "gender": patient_in.gender,
        "phone": patient_in.phone,
        "village": patient_in.village,
        "abha_id": patient_in.abha_id,
        "allergies": patient_in.allergies,
        "created_by": str(current_user.id),
    }

    if supabase is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is unavailable. Patient was not saved.",
        )

    try:
        res = (
            supabase
            .table("patients")
            .insert(insert_data)
            .execute()
        )

        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Patient registration failed: database returned no inserted record.",
            )

        return _patient_from_data(res.data[0])

    except HTTPException:
        raise

    except Exception as e:
        # IMPORTANT:
        # Do not silently return an in-memory success here.
        # The mobile app needs a non-2xx response so it can queue the
        # patient for offline synchronization.
        print(f"SUPABASE PATIENT INSERT ERROR: {e}")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Patient could not be saved to the database: {str(e)}",
        )


@router.get(
    "/",
    response_model=List[PatientOut],
    summary="List registered patients",
)
def list_patients(
    village: Optional[str] = Query(
        None,
        description="Filter by village",
    ),
    q: Optional[str] = Query(
        None,
        description="Search by name, phone, or ABHA ID",
    ),
    current_user: UserOut = Depends(get_current_user),
):
    """
    Get registered patients.

    ASHA:
        Only patients created by the authenticated ASHA are returned.

    HOSPITAL / DHO / ADMIN:
        Access all patients according to the existing backend role model.

    Supports:
        - village filtering
        - name search
        - phone search
        - ABHA ID search
    """

    if supabase is not None:
        try:
            query = supabase.table("patients").select("*")

            # ASHA users must only see their own patients.
            if current_user.role == UserRole.ASHA:
                query = query.eq(
                    "created_by",
                    str(current_user.id),
                )

            if village:
                query = query.eq("village", village)

            if q:
                query = query.or_(
                    f"name.ilike.%{q}%,"
                    f"phone.ilike.%{q}%,"
                    f"abha_id.ilike.%{q}%"
                )

            res = query.order(
                "created_at",
                desc=True,
            ).execute()

            if res.data is not None:
                return [
                    _patient_from_data(p)
                    for p in res.data
                ]

        except Exception as e:
            print(f"SUPABASE PATIENT LIST ERROR: {e}")

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Could not retrieve patients from database: {str(e)}",
            )

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Database service is unavailable.",
    )


@router.get(
    "/{patient_id}",
    response_model=PatientOut,
    summary="Get details of a single patient",
)
def get_patient(
    patient_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieve a single patient.

    ASHA users can only retrieve patients created by themselves.
    HOSPITAL / DHO / ADMIN users retain broader access.
    """

    if supabase is not None:
        try:
            query = (
                supabase
                .table("patients")
                .select("*")
                .eq("id", str(patient_id))
            )

            # Enforce ownership for ASHA.
            if current_user.role == UserRole.ASHA:
                query = query.eq(
                    "created_by",
                    str(current_user.id),
                )

            res = query.execute()

            if res.data and len(res.data) > 0:
                return _patient_from_data(res.data[0])

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID '{patient_id}' not found",
            )

        except HTTPException:
            raise

        except Exception as e:
            print(f"SUPABASE PATIENT GET ERROR: {e}")

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Could not retrieve patient from database: {str(e)}",
            )

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Database service is unavailable.",
    )


@router.patch(
    "/{patient_id}",
    response_model=PatientOut,
    summary="Update patient information",
)
def update_patient(
    patient_id: UUID,
    patient_in: PatientUpdate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Update patient information.

    ASHA users can only update their own patients.
    """

    update_fields = patient_in.model_dump(
        exclude_unset=True
    )

    if not update_fields:
        return get_patient(
            patient_id,
            current_user,
        )

    update_fields["updated_at"] = datetime.now(
        timezone.utc
    ).isoformat()

    if supabase is not None:
        try:
            query = (
                supabase
                .table("patients")
                .update(update_fields)
                .eq("id", str(patient_id))
            )

            # Enforce ownership for ASHA.
            if current_user.role == UserRole.ASHA:
                query = query.eq(
                    "created_by",
                    str(current_user.id),
                )

            res = query.execute()

            if res.data and len(res.data) > 0:
                return _patient_from_data(res.data[0])

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID '{patient_id}' not found",
            )

        except HTTPException:
            raise

        except Exception as e:
            print(f"SUPABASE PATIENT UPDATE ERROR: {e}")

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Could not update patient in database: {str(e)}",
            )

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Database service is unavailable.",
    )