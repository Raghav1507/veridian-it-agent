from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.ticket import TicketResponse


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get(
    "/tickets",
    response_model=list[TicketResponse]
)
def admin_list_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in {"it_agent", "it_admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only IT staff can access this page."
        )

    statement = (
        select(Ticket)
        .order_by(Ticket.created_at.desc())
    )

    return list(db.scalars(statement).all())