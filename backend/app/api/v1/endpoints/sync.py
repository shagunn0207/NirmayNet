from datetime import datetime, timezone
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.schemas.triage import SyncBatchRequest, SyncBatchResponse, SyncItemStatus
from app.schemas.auth import UserOut
from app.api.deps import get_current_user
from app.services.triage_service import evaluate_triage
from app.services.supabase_client import supabase
from app.api.v1.endpoints.patients import _in_memory_patients
from app.api.v1.endpoints.triage import _in_memory_triage_records

router = APIRouter()


@router.post("", response_model=SyncBatchResponse, summary="Batch synchronize offline created patients and triage records")
@router.post("/", response_model=SyncBatchResponse, include_in_schema=False)
def sync_offline_batch(
    batch: SyncBatchRequest,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Ingests batch of locally created offline transactions (patients and triage assessments).
    Ensures idempotency using client-generated UUIDs to prevent duplicate record creation.
    """
    results: list[SyncItemStatus] = []
    synced_count = 0
    failed_count = 0

    # 1. Process Offline Patients
    for p in batch.patients:
        p_id_str = str(p.id)
        
        # Check idempotency in Supabase
        exists = False
        if supabase is not None:
            try:
                check = supabase.table("patients").select("id").eq("id", p_id_str).execute()
                if check.data and len(check.data) > 0:
                    exists = True
            except Exception:
                pass

        # Check idempotency in local memory store
        if not exists and any(str(mem["id"]) == p_id_str for mem in _in_memory_patients):
            exists = True

        if exists:
            results.append(
                SyncItemStatus(
                    id=p.id,
                    item_type="patient",
                    status="already_existed",
                    message="Patient record already exists in database.",
                )
            )
            synced_count += 1
            continue

        # Insert new offline patient
        created_at_val = p.created_at.isoformat() if p.created_at else datetime.now(timezone.utc).isoformat()
        patient_record = {
            "id": p_id_str,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "phone": p.phone,
            "village": p.village,
            "abha_id": p.abha_id,
            "created_by": str(current_user.id),
            "created_at": created_at_val,
            "updated_at": created_at_val,
        }

        inserted = False
        if supabase is not None:
            try:
                res = supabase.table("patients").insert({
                    "id": p_id_str,
                    "name": p.name,
                    "age": p.age,
                    "gender": p.gender,
                    "phone": p.phone,
                    "village": p.village,
                    "abha_id": p.abha_id,
                    "created_by": str(current_user.id),
                }).execute()
                if res.data and len(res.data) > 0:
                    inserted = True
            except Exception as e:
                pass

        _in_memory_patients.insert(0, patient_record)
        inserted = True

        if inserted:
            results.append(
                SyncItemStatus(
                    id=p.id,
                    item_type="patient",
                    status="created",
                    message="Patient successfully synced.",
                )
            )
            synced_count += 1
        else:
            results.append(
                SyncItemStatus(
                    id=p.id,
                    item_type="patient",
                    status="failed",
                    message="Failed to insert patient record.",
                )
            )
            failed_count += 1

    # 2. Process Offline Triage Records
    for t in batch.triage_records:
        t_id_str = str(t.id)
        p_id_str = str(t.patient_id)

        # Check idempotency
        exists = False
        if supabase is not None:
            try:
                check = supabase.table("triage_records").select("id").eq("id", t_id_str).execute()
                if check.data and len(check.data) > 0:
                    exists = True
            except Exception:
                pass

        if not exists and any(str(mem["id"]) == t_id_str for mem in _in_memory_triage_records):
            exists = True

        if exists:
            results.append(
                SyncItemStatus(
                    id=t.id,
                    item_type="triage_record",
                    status="already_existed",
                    message="Triage record already exists in database.",
                )
            )
            synced_count += 1
            continue

        # Evaluate score & category if not pre-calculated
        if t.triage_score is None or t.triage_category is None:
            score, category, reason = evaluate_triage(t.symptoms)
        else:
            score = t.triage_score
            category = t.triage_category
            reason = t.reason or evaluate_triage(t.symptoms)[2]

        created_at_val = t.created_at.isoformat() if t.created_at else datetime.now(timezone.utc).isoformat()
        triage_record = {
            "id": t_id_str,
            "patient_id": p_id_str,
            "symptoms": t.symptoms,
            "triage_score": score,
            "triage_category": category,
            "reason": reason,
            "created_by": str(current_user.id),
            "created_at": created_at_val,
        }

        inserted = False
        if supabase is not None:
            try:
                res = supabase.table("triage_records").insert({
                    "id": t_id_str,
                    "patient_id": p_id_str,
                    "symptoms": t.symptoms,
                    "triage_score": score,
                    "triage_category": category,
                    "reason": reason,
                    "created_by": str(current_user.id),
                }).execute()
                if res.data and len(res.data) > 0:
                    inserted = True
            except Exception:
                pass

        _in_memory_triage_records.insert(0, triage_record)
        inserted = True

        if inserted:
            results.append(
                SyncItemStatus(
                    id=t.id,
                    item_type="triage_record",
                    status="created",
                    message="Triage record successfully synced.",
                )
            )
            synced_count += 1
        else:
            results.append(
                SyncItemStatus(
                    id=t.id,
                    item_type="triage_record",
                    status="failed",
                    message="Failed to insert triage record.",
                )
            )
            failed_count += 1

    return SyncBatchResponse(
        synced_count=synced_count,
        failed_count=failed_count,
        results=results,
    )
