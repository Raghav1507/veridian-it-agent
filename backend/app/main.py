from fastapi import FastAPI, Depends
from sqlalchemy import text
from app.routes.tickets import router as tickets_router
from app.routes.audit import router as audit_router
from app.database import engine
from app.routes.auth import router as auth_router
from app.auth.dependencies import require_roles
from app.models.user import User
from fastapi.middleware.cors import CORSMiddleware
from app.routes.admin import router as admin_router

app = FastAPI(
    title="Veridian IT Support API",
    description="Backend API for Veridian Corp Internal IT Support Agent",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(tickets_router)
app.include_router(audit_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "message": "Veridian IT Support API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "veridian-it-support"
    }


@app.get("/health/database")
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "detail": str(e)
        }
    
@app.get("/admin/test")
def admin_test(
    current_user: User = Depends(
        require_roles("it_admin")
    )
):
    return {
        "message": "IT Admin access granted",
        "user": current_user.email
    }

