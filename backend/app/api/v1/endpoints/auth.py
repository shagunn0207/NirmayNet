from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import LoginRequest, Token, UserOut, UserRole
from app.core.security import create_access_token, verify_password
from app.services.supabase_client import supabase
from app.api.deps import get_current_user, DEMO_USER, DEMO_HOSPITAL_USER

router = APIRouter()


@router.post("/login", response_model=Token, summary="Authenticate user and return JWT access token")
def login(request: LoginRequest):
    """
    Authenticate user using credentials (username / phone / email and password).
    Returns JWT access token and user profile including role.
    """
    username = request.username.strip()
    password = request.password.strip()

    user_out: UserOut = None

    # 1. Check for Demo Accounts
    if username == "ASHA_NAND_023" and password in ("asha2024", "password"):
        user_out = DEMO_USER
    elif username in ("HOSPITAL_NAND_001", "HOSPITAL_DEMO") and password in ("hospital2024", "asha2024", "password"):
        user_out = DEMO_HOSPITAL_USER

    # 2. Check Supabase database if not demo user
    elif supabase is not None:
        try:
            # Query by email, phone, or name
            res = supabase.table("users").select("*").or_(
                f"email.eq.{username},phone.eq.{username},name.eq.{username}"
            ).execute()

            if res.data and len(res.data) > 0:
                u_data = res.data[0]
                hashed_pw = u_data.get("hashed_password") or ""
                
                # Verify password
                if verify_password(password, hashed_pw):
                    user_out = UserOut(
                        id=UUID(u_data["id"]),
                        name=u_data["name"],
                        email=u_data.get("email"),
                        phone=u_data.get("phone"),
                        role=UserRole(u_data.get("role", "ASHA")),
                        village=u_data.get("village"),
                        facility_name=u_data.get("facility_name"),
                    )
        except Exception as err:
            pass

    if not user_out:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT Token
    access_token = create_access_token(
        data={
            "sub": str(user_out.id),
            "username": username,
            "name": user_out.name,
            "role": user_out.role.value,
            "village": user_out.village,
            "facility_name": user_out.facility_name,
        }
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_out,
    )


@router.get("/me", response_model=UserOut, summary="Get currently authenticated user profile")
def get_me(current_user: UserOut = Depends(get_current_user)):
    """
    Returns profile information of the currently authenticated user.
    Requires Bearer JWT token in Authorization header.
    """
    return current_user
