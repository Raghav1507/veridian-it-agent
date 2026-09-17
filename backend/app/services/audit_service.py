from uuid import UUID

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    action: str,
    description: str,
    user_id: UUID | None = None,
    ticket_id: UUID | None = None,
):
    audit_log = AuditLog(
        user_id=user_id,
        ticket_id=ticket_id,
        action=action,
        description=description,
    )

    db.add(audit_log)

    return audit_log