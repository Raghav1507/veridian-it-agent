import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.ticket import (
    TicketCreate,
    TicketResponse,
    TicketUpdate,
)
from app.services.ticket_service import generate_ticket_number
from app.services.audit_service import create_audit_log


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)


# =========================
# CREATE TICKET
# =========================

@router.post(
    "",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED
)
def create_ticket(
    request: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = Ticket(
        ticket_number=generate_ticket_number(),
        user_id=current_user.id,
        title=request.title.strip(),
        description=request.description.strip(),
        category=request.category.strip().lower(),
        priority="medium",
        status="open",
        source="employee"
    )

    db.add(ticket)

    # Generate ticket ID before creating audit record
    db.flush()

    create_audit_log(
        db=db,
        action="TICKET_CREATED",
        description=f"Created ticket {ticket.ticket_number}",
        user_id=current_user.id,
        ticket_id=ticket.id,
    )

    db.commit()
    db.refresh(ticket)

    return ticket


# =========================
# LIST TICKETS
# =========================

@router.get(
    "",
    response_model=list[TicketResponse]
)
def list_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role in {"it_agent", "it_admin"}:
        statement = (
            select(Ticket)
            .order_by(Ticket.created_at.desc())
        )
    else:
        statement = (
            select(Ticket)
            .where(Ticket.user_id == current_user.id)
            .order_by(Ticket.created_at.desc())
        )

    return list(db.scalars(statement).all())


# =========================
# GET SINGLE TICKET
# =========================

@router.get(
    "/{ticket_id}",
    response_model=TicketResponse
)
def get_ticket(
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

    can_view_all = current_user.role in {
        "it_agent",
        "it_admin"
    }

    if ticket.user_id != current_user.id and not can_view_all:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this ticket."
        )

    return ticket


# =========================
# UPDATE TICKET
# =========================

@router.patch(
    "/{ticket_id}",
    response_model=TicketResponse
)
def update_ticket(
    ticket_id: uuid.UUID,
    request: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only IT staff can update tickets
    if current_user.role not in {"it_agent", "it_admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only IT staff can update tickets."
        )

    ticket = db.get(Ticket, ticket_id)

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found."
        )

    # -------------------------
    # Update status
    # -------------------------

    if request.status is not None:
        allowed_statuses = {
            "open",
            "in_progress",
            "waiting_for_employee",
            "resolved",
            "closed",
        }

        if request.status not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid ticket status."
            )

        ticket.status = request.status

    # -------------------------
    # Update priority
    # -------------------------

    if request.priority is not None:
        allowed_priorities = {
            "low",
            "medium",
            "high",
            "critical",
        }

        if request.priority not in allowed_priorities:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid ticket priority."
            )

        ticket.priority = request.priority

    # -------------------------
    # Assign IT staff
    # -------------------------

    if request.assigned_to is not None:
        agent = db.get(User, request.assigned_to)

        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned user not found."
            )

        if agent.role not in {"it_agent", "it_admin"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ticket can only be assigned to IT staff."
            )

        ticket.assigned_to = agent.id

    # -------------------------
    # Add resolution
    # -------------------------

    if request.resolution is not None:
        ticket.resolution = request.resolution.strip()

    # -------------------------
    # Resolution timestamp
    # -------------------------

    if ticket.status == "resolved" and ticket.resolved_at is None:
        from datetime import datetime, timezone

        ticket.resolved_at = datetime.now(timezone.utc)

    # -------------------------
    # AUDIT LOG
    # -------------------------

    create_audit_log(
        db=db,
        action="TICKET_UPDATED",
        description=f"Updated ticket {ticket.ticket_number}",
        user_id=current_user.id,
        ticket_id=ticket.id,
    )

    db.commit()
    db.refresh(ticket)

    return ticket