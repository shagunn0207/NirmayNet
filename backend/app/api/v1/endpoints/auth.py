import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import LoginRequest, RegisterRequest, Token, UserOut, UserRole
from app.core.security import create_access_token, verify_password, get_password_hash
from app.services.supabase_client import supabase
from app.api.deps import get_current_user, DEMO_USER, DEMO_HOSPITAL_USER

router = APIRouter()

# Local persistent store for registered users across runtime restarts
DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
USERS_FILE = DATA_DIR / "users_store.json"


def _load_in_memory_users() -> List[dict]:
    if USERS_FILE.exists():
        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def _save_in_memory_users():
    try:
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(_in_memory_users, f, indent=2)
    except Exception:
        pass


_in_memory_users: List[dict] = _load_in_memory_users()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED, summary="Register a new user account")
def register(request: RegisterRequest):
    """
    Registers a new user account (e.g. ASHA worker) in the system.
    Persists user credentials using secure password hashing.
    """
    username = request.username.strip()
    password = request.password.strip()
    name = (request.fullName or request.name or username).strip()

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required",
        )

    # 1. Check for duplicates in demo users
    if username == "ASHA_NAND_023" or username.lower() in ("hospital_nand_001", "hospital_demo"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    # 2. Check for duplicates in memory/store
    user_email = request.email or (username if "@" in username else f"{username.lower()}@nirmay.net")
    for u in _in_memory_users:
        u_user = u.get("username", "").lower()
        u_name = u.get("name", "").lower()
        u_email = u.get("email", "").lower()
        if username.lower() in (u_user, u_name, u_email) or user_email.lower() == u_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken",
            )

    # 3. Check for duplicates in Supabase database
    if supabase is not None:
        try:
            res = supabase.table("users").select("*").or_(
                f"name.eq.{username},email.eq.{username},email.eq.{user_email}"
            ).execute()
            if res.data and len(res.data) > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken",
                )
        except HTTPException:
            raise
        except Exception:
            pass

    # 4. Hash password securely
    hashed_password = get_password_hash(password)
    user_id = uuid4()
    role_enum = request.role or UserRole.ASHA

    user_dict = {
        "id": str(user_id),
        "username": username,
        "name": name,
        "email": user_email,
        "phone": request.phone or "9823011234",
        "hashed_password": hashed_password,
        "role": role_enum.value,
        "village": request.village or "Chinchpada",
        "facility_name": request.facility_name or "Chinchpada Sub-Center",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    _in_memory_users.append(user_dict)
    _save_in_memory_users()

    # 5. Insert into Supabase if connected
    if supabase is not None:
        try:
            supabase.table("users").insert({
                "id": str(user_id),
                "name": name,
                "email": user_dict["email"],
                "phone": user_dict["phone"],
                "hashed_password": hashed_password,
                "role": role_enum.value,
                "village": user_dict["village"],
                "facility_name": user_dict["facility_name"],
            }).execute()
        except Exception:
            pass

    return UserOut(
        id=user_id,
        name=name,
        email=user_dict["email"],
        phone=user_dict["phone"],
        role=role_enum,
        village=user_dict["village"],
        facility_name=user_dict["facility_name"],
    )


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

    # 2. Check in-memory / persistent registered users
    if not user_out:
        for u in _in_memory_users:
            u_username = u.get("username", "")
            u_name = u.get("name", "")
            u_email = u.get("email", "")
            u_phone = u.get("phone", "")
            if username.lower() in (u_username.lower(), u_name.lower(), u_email.lower(), u_phone.lower()):
                if verify_password(password, u.get("hashed_password", "")):
                    user_out = UserOut(
                        id=UUID(u["id"]),
                        name=u["name"],
                        email=u.get("email"),
                        phone=u.get("phone"),
                        role=UserRole(u.get("role", "ASHA")),
                        village=u.get("village"),
                        facility_name=u.get("facility_name"),
                    )
                    break

    # 3. Check Supabase database if not found in memory
    if not user_out and supabase is not None:
        try:
            # Query by email (including username@nirmay.net format), phone, or name
            alt_email = username if "@" in username else f"{username.lower()}@nirmay.net"
            res = supabase.table("users").select("*").or_(
                f"email.eq.{username},email.eq.{alt_email},phone.eq.{username},name.eq.{username}"
            ).execute()

            if res.data and len(res.data) > 0:
                for u_data in res.data:
                    hashed_pw = u_data.get("hashed_password") or ""
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
                        # Cache into in-memory store so future lookups succeed
                        cached_u = {
                            "id": str(user_out.id),
                            "username": username,
                            "name": user_out.name,
                            "email": user_out.email,
                            "phone": user_out.phone,
                            "hashed_password": hashed_pw,
                            "role": user_out.role.value,
                            "village": user_out.village,
                            "facility_name": user_out.facility_name,
                        }
                        if not any(u.get("id") == cached_u["id"] for u in _in_memory_users):
                            _in_memory_users.append(cached_u)
                            _save_in_memory_users()
                        break
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
