from datetime import datetime, timezone
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.referral import DispatchCreate, DispatchOut, DispatchStatusEnum, ReferralStatusEnum, ReferralStatusUpdate
from app.schemas.auth import UserOut
from app.api.deps import get_current_user
from app.services.dispatch_service import simulate_108_dispatch
from app.services.supabase_client import supabase
from app.api.v1.endpoints.referrals import get_referral, update_referral_status

router = APIRouter()

# Local in-memory store fallback for dispatch logs
_in_memory_dispatch_logs: List[dict] = []


@router.post("/108", response_model=DispatchOut, status_code=status.HTTP_201_CREATED, summary="Trigger simulated 108 emergency ambulance dispatch")
def create_108_dispatch(
    dispatch_in: DispatchCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Simulates a 108 emergency ambulance dispatch request.
    Validates referral existence and updates referral status to DISPATCHED.
    
    NOTE: Prototype simulation only for SIH demonstration.
    """
    # 1. Validate referral existence
    referral = get_referral(dispatch_in.referral_id, current_user)

    # 2. Simulate 108 ambulance dispatch details
    dispatch_data = simulate_108_dispatch(dispatch_in.referral_id)

    # 3. Update referral status to DISPATCHED
    if referral.status == ReferralStatusEnum.PENDING:
        update_referral_status(
            dispatch_in.referral_id,
            ReferralStatusUpdate(status=ReferralStatusEnum.DISPATCHED),
            current_user,
        )

    # 4. Save in Supabase database
    if supabase is not None:
        try:
            res = supabase.table("dispatch_logs").insert({
                "id": dispatch_data["id"],
                "referral_id": dispatch_data["referral_id"],
                "vehicle_number": dispatch_data["vehicle_number"],
                "driver_name": dispatch_data["driver_name"],
                "driver_phone": dispatch_data["driver_phone"],
                "eta_minutes": dispatch_data["eta_minutes"],
                "status": dispatch_data["status"],
            }).execute()

            if res.data and len(res.data) > 0:
                d = res.data[0]
                return DispatchOut(
                    id=UUID(d["id"]),
                    referral_id=UUID(d["referral_id"]),
                    vehicle_number=d.get("vehicle_number"),
                    driver_name=d.get("driver_name"),
                    driver_phone=d.get("driver_phone"),
                    eta_minutes=d.get("eta_minutes"),
                    status=DispatchStatusEnum(d.get("status", "DISPATCHED")),
                    requested_at=d.get("requested_at") or datetime.now(timezone.utc),
                    updated_at=d.get("updated_at") or datetime.now(timezone.utc),
                    simulation=True,
                    message=dispatch_data["message"],
                )
        except Exception:
            pass

    _in_memory_dispatch_logs.insert(0, dispatch_data)

    return DispatchOut(
        id=UUID(dispatch_data["id"]),
        referral_id=UUID(dispatch_data["referral_id"]),
        vehicle_number=dispatch_data["vehicle_number"],
        driver_name=dispatch_data["driver_name"],
        driver_phone=dispatch_data["driver_phone"],
        eta_minutes=dispatch_data["eta_minutes"],
        status=DispatchStatusEnum(dispatch_data["status"]),
        requested_at=dispatch_data["requested_at"],
        updated_at=dispatch_data["updated_at"],
        simulation=True,
        message=dispatch_data["message"],
    )


@router.get("/{referral_id}", response_model=DispatchOut, summary="Get 108 ambulance dispatch status for a referral")
def get_dispatch(
    referral_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieves dispatch log details for a specific referral.
    Returns 404 if no dispatch log exists for the referral.
    """
    if supabase is not None:
        try:
            res = supabase.table("dispatch_logs").select("*").eq("referral_id", str(referral_id)).execute()
            if res.data and len(res.data) > 0:
                d = res.data[0]
                return DispatchOut(
                    id=UUID(d["id"]),
                    referral_id=UUID(d["referral_id"]),
                    vehicle_number=d.get("vehicle_number"),
                    driver_name=d.get("driver_name"),
                    driver_phone=d.get("driver_phone"),
                    eta_minutes=d.get("eta_minutes"),
                    status=DispatchStatusEnum(d.get("status", "DISPATCHED")),
                    requested_at=d.get("requested_at") or datetime.now(timezone.utc),
                    updated_at=d.get("updated_at") or datetime.now(timezone.utc),
                    simulation=True,
                    message="EMERGENCY SIMULATION: 108 Ambulance MH-39-A-1080 dispatched.",
                )
        except Exception:
            pass

    for d in _in_memory_dispatch_logs:
        if str(d["referral_id"]) == str(referral_id):
            return DispatchOut(
                id=UUID(d["id"]),
                referral_id=UUID(d["referral_id"]),
                vehicle_number=d.get("vehicle_number"),
                driver_name=d.get("driver_name"),
                driver_phone=d.get("driver_phone"),
                eta_minutes=d.get("eta_minutes"),
                status=DispatchStatusEnum(d.get("status", "DISPATCHED")),
                requested_at=d["requested_at"],
                updated_at=d["updated_at"],
                simulation=True,
                message=d.get("message"),
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No dispatch record found for referral ID '{referral_id}'",
    )
