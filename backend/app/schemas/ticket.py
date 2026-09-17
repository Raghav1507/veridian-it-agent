import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class TicketCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5, max_length=5000)
    category: str = Field(min_length=2, max_length=50)


class TicketResponse(BaseModel):
    id: uuid.UUID
    ticket_number: str
    user_id: uuid.UUID
    assigned_to: uuid.UUID | None

    title: str
    description: str
    category: str
    priority: str
    status: str
    source: str
    resolution: str | None

    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None

    model_config = {
        "from_attributes": True
    }

class TicketUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    assigned_to: uuid.UUID | None = None
    resolution: str | None = None
    