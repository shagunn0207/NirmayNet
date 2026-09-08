import uuid
from datetime import datetime, timezone
from typing import Dict, Any


def simulate_108_dispatch(referral_id: uuid.UUID) -> Dict[str, Any]:
    """
    Simulates a 108 Emergency Ambulance dispatch for rural care continuity.
    This creates simulated dispatch details including vehicle number, driver details, and ETA.
    
    NOTE: This is a prototype simulation for SIH demonstration. No real emergency calls are made.
    """
    dispatch_id = uuid.uuid4()
    now_iso = datetime.now(timezone.utc).isoformat()

    return {
        "id": str(dispatch_id),
        "referral_id": str(referral_id),
        "vehicle_number": "MH-39-A-1080",
        "driver_name": "Ramesh Shinde",
        "driver_phone": "9822108108",
        "eta_minutes": 12,
        "status": "DISPATCHED",
        "requested_at": now_iso,
        "updated_at": now_iso,
        "simulation": True,
        "message": "EMERGENCY SIMULATION: 108 Ambulance MH-39-A-1080 dispatched. Driver: Ramesh Shinde (9822108108). ETA: 12 minutes.",
    }
