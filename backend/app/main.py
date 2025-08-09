from __future__ import annotations

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .config import settings
from .db import connect_to_mongo, close_mongo_connection
from .migrations import ensure_validators_and_indexes
import logging
from .admin_db import router as admin_db_router


app = FastAPI()


logger = logging.getLogger("uddaan.app")


@app.on_event("startup")
async def startup() -> None:
    try:
        db = await connect_to_mongo()
        await ensure_validators_and_indexes(db)
        logger.info("Mongo connected; validators applied")
    except Exception as exc:
        logger.warning(f"Mongo not ready at startup: {exc}")


@app.on_event("shutdown")
async def shutdown() -> None:
    try:
        await close_mongo_connection()
    except Exception:
        pass


app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"ok": "true"}

app.include_router(admin_db_router)


