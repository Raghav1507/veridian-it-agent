from app.auth.dependencies import get_current_user
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    HTTPException,
    Response,
    status,
)
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.security import (
    generate_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.database import get_db
from app.models.session import Session as DBSession
from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


SESSION_COOKIE_NAME = "veridian_session"
SESSION_DURATION_DAYS = 7


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    is_active: bool

    model_config = {
        "from_attributes": True
    }


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.scalar(
        select(User).where(
            User.email == request.email.lower()
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    if len(request.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )

    user = User(
        email=request.email.lower(),
        password_hash=hash_password(request.password),
        full_name=request.full_name.strip(),
        role="employee",
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login")
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    user = db.scalar(
        select(User).where(
            User.email == request.email.lower()
        )
    )

    if not user or not verify_password(
        request.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive."
        )

    raw_token = generate_session_token()
    token_hash = hash_session_token(raw_token)

    session = DBSession(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=SESSION_DURATION_DAYS)
    )

    db.add(session)
    db.commit()

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=raw_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=SESSION_DURATION_DAYS * 24 * 60 * 60,
        path="/"
    )

    return {
        "message": "Login successful",
        "user": UserResponse.model_validate(user)
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.post("/logout")
def logout(
    response: Response,
    session_token: str | None = Cookie(
    default=None,
    alias=SESSION_COOKIE_NAME
    ),
    db: Session = Depends(get_db)
):
    if session_token:
        token_hash = hash_session_token(session_token)

        session = db.scalar(
            select(DBSession).where(
                DBSession.token_hash == token_hash,
                DBSession.revoked_at.is_(None)
            )
        )

        if session:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/"
    )

    return {
        "message": "Logout successful"
    }