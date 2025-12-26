from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

from app.routers import auth, patients, encounters, me, appointments

def create_app() -> FastAPI:
    app = FastAPI(title="Ophtha Clinic Core API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Para MVP: crea tablas al iniciar. Luego pasamos a Alembic.
    Base.metadata.create_all(bind=engine)

    app.include_router(auth.router)
    app.include_router(me.router)
    app.include_router(patients.router)
    app.include_router(encounters.router)
    app.include_router(appointments.router)

    @app.get("/health")
    def health():
        return {"ok": True}

    return app

app = create_app()
