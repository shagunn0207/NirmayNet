from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.referral import DHOMetricsOut
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase
from app.api.v1.endpoints.referrals import _in_memory_referrals
from app.api.v1.endpoints.patients import _in_memory_patients
from app.api.v1.endpoints.triage import _in_memory_triage_records

router = APIRouter()


@router.get("/dho", response_model=DHOMetricsOut, summary="District Health Officer monitoring metrics")
def get_dho_metrics(
    current_user: UserOut = Depends(get_current_user),
):
    """
    Returns district-level monitoring metrics for DHO and ADMIN roles only.
    Calculates metrics from live referral, patient, and triage data.
    """
    if current_user.role not in (UserRole.DHO, UserRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only DHO or ADMIN users can access district metrics",
        )

    referrals = list(_in_memory_referrals)
    patients = list(_in_memory_patients)
    triage_records = list(_in_memory_triage_records)

    # Aggregate referral counts by status
    status_counts: dict = defaultdict(int)
    village_counts: dict = defaultdict(int)
    hospital_counts: dict = defaultdict(int)
    triage_cat_counts: dict = defaultdict(int)

    for r in referrals:
        status_counts[r.get("status", "PENDING")] += 1
        patient = next((p for p in patients if str(p["id"]) == str(r.get("patient_id", ""))), None)
        if patient:
            village_counts[patient.get("village", "Unknown")] += 1
        hospital_counts[r.get("destination_hospital", "Unknown")] += 1

    for t in triage_records:
        triage_cat_counts[t.get("triage_category", "ROUTINE")] += 1

    total_referrals = len(referrals)
    completed = status_counts.get("COMPLETED", 0)
    completion_rate = round((completed / total_referrals * 100), 2) if total_referrals > 0 else 0.0

    return DHOMetricsOut(
        total_referrals=total_referrals,
        emergency_referrals=triage_cat_counts.get("EMERGENCY", 0),
        urgent_referrals=triage_cat_counts.get("URGENT", 0),
        routine_referrals=triage_cat_counts.get("ROUTINE", 0),
        pending_referrals=status_counts.get("PENDING", 0),
        dispatched_referrals=status_counts.get("DISPATCHED", 0),
        confirmed_arrivals=status_counts.get("CONFIRMED_ARRIVAL", 0),
        in_consultation=status_counts.get("IN_CONSULTATION", 0),
        completed_referrals=completed,
        cancelled_referrals=status_counts.get("CANCELLED", 0),
        total_patients=len(patients),
        total_triage_assessments=len(triage_records),
        completion_rate=completion_rate,
        referrals_by_village=dict(village_counts),
        referrals_by_hospital=dict(hospital_counts),
        referrals_by_triage_category=dict(triage_cat_counts),
    )
