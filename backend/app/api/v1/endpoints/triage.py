from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.triage import TriageAssessRequest, TriageRecordOut
from app.schemas.auth import UserOut
from app.api.deps import get_current_user
from app.services.triage_service import evaluate_triage
from app.services.supabase_client import supabase
from app.api.v1.endpoints.patients import _in_memory_patients, get_patient

router = APIRouter()

# In-memory store fallback for triage records
_in_memory_triage_records: List[dict] = []


@router.post("/assess", response_model=TriageRecordOut, status_code=status.HTTP_201_CREATED, summary="Evaluate symptoms and record clinical triage assessment")
def assess_triage(
    request: TriageAssessRequest,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Evaluates patient symptoms, calculates clinical risk category (EMERGENCY, URGENT, ROUTINE),
    and stores the triage assessment record.
    """
    # 1. Validate that patient exists
    try:
        get_patient(request.patient_id, current_user)
    except HTTPException as e:
        if e.status_code == status.HTTP_404_NOT_FOUND:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID '{request.patient_id}' not found",
            )
        raise e

    # 2. Perform rule-based triage evaluation
    score, category, reason = evaluate_triage(request.symptoms)

    triage_id = uuid4()
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "id": str(triage_id),
        "patient_id": str(request.patient_id),
        "symptoms": request.symptoms,
        "triage_score": score,
        "triage_category": category,
        "reason": reason,
        "created_by": str(current_user.id),
        "created_at": now_iso,
    }

    # 3. Store in Supabase database
    if supabase is not None:
        try:
            res = supabase.table("triage_records").insert({
                "id": str(triage_id),
                "patient_id": str(request.patient_id),
                "symptoms": request.symptoms,
                "triage_score": score,
                "triage_category": category,
                "reason": reason,
                "created_by": str(current_user.id),
            }).execute()

            if res.data and len(res.data) > 0:
                rec = res.data[0]
                return TriageRecordOut(
                    id=UUID(rec["id"]),
                    patient_id=UUID(rec["patient_id"]),
                    symptoms=rec["symptoms"],
                    triage_score=rec["triage_score"],
                    triage_category=rec["triage_category"],
                    reason=rec.get("reason"),
                    created_by=UUID(rec["created_by"]) if rec.get("created_by") else None,
                    created_at=rec.get("created_at") or datetime.now(timezone.utc),
                )
        except Exception:
            pass

    # Fallback in-memory storage
    _in_memory_triage_records.insert(0, record)

    return TriageRecordOut(
        id=triage_id,
        patient_id=request.patient_id,
        symptoms=request.symptoms,
        triage_score=score,
        triage_category=category,
        reason=reason,
        created_by=current_user.id,
        created_at=datetime.now(timezone.utc),
    )
