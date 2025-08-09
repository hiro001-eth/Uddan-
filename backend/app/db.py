from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> AsyncIOMotorDatabase:
    global client, db
    if client is None:
        client = AsyncIOMotorClient(settings.mongo_url)
        db = client[settings.mongo_db]
    assert db is not None
    return db


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()
        client = None


async def apply_migrations(database: AsyncIOMotorDatabase | None = None) -> None:
    database = database or db or await connect_to_mongo()
    # indexes
    await database.jobs.create_index("id", unique=True)
    await database.jobs.create_index([("country", 1), ("job_type", 1), ("status", 1), ("featured", -1)])
    await database.jobs.create_index([("title", "text"), ("description", "text"), ("company.name", "text")])
    await database.applications.create_index([("job_id", 1), ("status", 1)])
    await database.applications.create_index([("candidate.name", "text"), ("candidate.email", "text")])


