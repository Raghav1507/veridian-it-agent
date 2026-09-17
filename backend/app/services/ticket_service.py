import secrets
from datetime import datetime, timezone


def generate_ticket_number() -> str:
    year = datetime.now(timezone.utc).year
    random_part = secrets.token_hex(3).upper()

    return f"IT-{year}-{random_part}"