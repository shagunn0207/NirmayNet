import uuid
from typing import Optional, Dict, Any
from app.core.config import settings


def generate_jitsi_room(patient_id: uuid.UUID, referral_id: Optional[uuid.UUID] = None) -> Dict[str, Any]:
    """
    Generates a unique Jitsi Meet teleconsultation room ID and URL.
    This provides video conferencing support for ASHA worker to PHC doctor consultation.
    """
    short_uuid = str(uuid.uuid4()).split("-")[0]
    patient_short = str(patient_id).split("-")[0]
    
    room_id = f"nirmaynet_teleconsult_{patient_short}_{short_uuid}"
    jitsi_domain = getattr(settings, "JITSI_DOMAIN", "meet.jit.si")
    jitsi_url = f"https://{jitsi_domain}/{room_id}"

    return {
        "room_id": room_id,
        "jitsi_domain": jitsi_domain,
        "jitsi_url": jitsi_url,
        "patient_id": str(patient_id),
        "referral_id": str(referral_id) if referral_id else None,
        "simulation_mode": True,
        "provider": "Jitsi Meet WebRTC",
    }
