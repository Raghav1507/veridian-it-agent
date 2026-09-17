from datetime import datetime, timezone

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.security import hash_session_token
from app.database import get_db
from app.models.session import Session as DBSession
from app.models.user import User


SESSION_COOKIE_NAME = "veridian_session"


def get_current_user(
    session_token: str | None = Cookie(
    default=None,
    alias="veridian_session"
    ),
    db: Session = Depends(get_db)
) -> User:

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required."
        )

    token_hash = hash_session_token(session_token)

    session = db.scalar(
        select(DBSession).where(
            DBSession.token_hash == token_hash,
            DBSession.revoked_at.is_(None),
            DBSession.expires_at > datetime.now(timezone.utc)
        )
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session."
        )

    user = db.get(User, session.user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is unavailable."
        )

    return user

def require_roles(*allowed_roles: str):
    def role_checker(
        current_user: User = Depends(get_current_user)
    ) -> User:

        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )

        return current_user

    return role_checker