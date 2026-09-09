from typing import Dict, Any
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.services.supabase_client import supabase
from app.schemas.auth import UserOut, UserRole

security_scheme = HTTPBearer(auto_error=True)

# Demo User constant for offline/prototype testing
DEMO_USER = UserOut(
    id=UUID("00000000-0000-0000-0000-000000000001"),
    name="Anandi Patil (ASHA Worker)",
    email="asha.nand.023@nirmay.net",
    phone="9823011234",
    role=UserRole.ASHA,
    village="Chinchpada",
    facility_name="Chinchpada Sub-Center",
)

DEMO_HOSPITAL_USER = UserOut(
    id=UUID("00000000-0000-0000-0000-000000000002"),
    name="District Hospital Nandurbar",
    email="hospital.nandurbar@nirmay.net",
    phone="9823099999",
    role=UserRole.HOSPITAL,
    village="Nandurbar",
    facility_name="District Hospital Nandurbar",
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> UserOut:
    """
    Validates JWT Bearer token and returns the current authenticated user profile.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str: str = payload["sub"]

    # Check for demo user
    if user_id_str == str(DEMO_USER.id) or payload.get("username") == "ASHA_NAND_023":
        return DEMO_USER
    if user_id_str == str(DEMO_HOSPITAL_USER.id) or payload.get("username") in ("HOSPITAL_NAND_001", "HOSPITAL_DEMO"):
        return DEMO_HOSPITAL_USER

    # Query database for user profile
    if supabase is not None:
        try:
            res = supabase.table("users").select("*").eq("id", user_id_str).execute()
            if res.data and len(res.data) > 0:
                u_data = res.data[0]
                return UserOut(
                    id=UUID(u_data["id"]),
                    name=u_data["name"],
                    email=u_data.get("email"),
                    phone=u_data.get("phone"),
                    role=UserRole(u_data.get("role", "ASHA")),
                    village=u_data.get("village"),
                    facility_name=u_data.get("facility_name"),
                )
        except Exception as e:
            # Fallback to token payload data if database lookup fails
            pass

    # If payload contains complete user details from login creation
    if "name" in payload and "role" in payload:
        return UserOut(
            id=UUID(user_id_str),
            name=payload["name"],
            email=payload.get("email"),
            phone=payload.get("phone"),
            role=UserRole(payload["role"]),
            village=payload.get("village"),
            facility_name=payload.get("facility_name"),
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User not found",
        headers={"WWW-Authenticate": "Bearer"},
    )
