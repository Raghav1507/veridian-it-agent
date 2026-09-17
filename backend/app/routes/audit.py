import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.audit_log import AuditLog
from app.models.ticket import Ticket
from app.models.user import User


router = APIRouter(
    prefix="/audit",
    tags=["Audit Trail"]
)


class AuditLogResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID | None
    ticket_id: uuid.UUID | None
    action: str
    description: str
    created_at: str

    model_config = {
        "from_attributes": True
    }


@router.get(
    "",
    response_model=list[AuditLogResponse]
)
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role in {"it_agent", "it_admin"}:
        statement = (
            select(AuditLog)
            .order_by(AuditLog.created_at.desc())
        )
    else:
        statement = (
            select(AuditLog)
            .where(AuditLog.user_id == current_user.id)
            .order_by(AuditLog.created_at.desc())
        )

    logs = db.scalars(statement).all()

    return [
        AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            ticket_id=log.ticket_id,
            action=log.action,
            description=log.description,
            created_at=log.created_at.isoformat()
        )
        for log in logs
    ]


@router.get(
    "/tickets/{ticket_id}",
    response_model=list[AuditLogResponse]
)
def get_ticket_audit(
    ticket_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = db.get(Ticket, ticket_id)

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found."
        )

    if (
        ticket.user_id != current_user.id
        and current_user.role not in {"it_agent", "it_admin"}
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this audit trail."
        )

    statement = (
        select(AuditLog)
        .where(AuditLog.ticket_id == ticket_id)
        .order_by(AuditLog.created_at.asc())
    )

    logs = db.scalars(statement).all()

    return [
        AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            ticket_id=log.ticket_id,
            action=log.action,
            description=log.description,
            created_at=log.created_at.isoformat()
        )
        for log in logs
    ]