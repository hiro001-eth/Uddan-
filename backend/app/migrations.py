from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorDatabase


async def ensure_validators_and_indexes(db: AsyncIOMotorDatabase) -> None:
    # Jobs
    try:
        await db.create_collection("jobs")
    except Exception:
        pass
    await db.jobs.create_index("slug", unique=True, sparse=True)
    await db.jobs.create_index([("country", 1), ("job_type", 1), ("status", 1), ("featured", -1)])
    await db.jobs.create_index([("title", "text"), ("description", "text"), ("company.name", "text")])

    jobs_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["title", "country", "status", "created_at"],
            "properties": {
                "title": {"bsonType": "string"},
                "slug": {"bsonType": "string"},
                "company": {"bsonType": "object"},
                "country": {"bsonType": "string"},
                "city": {"bsonType": "string"},
                "job_type": {"bsonType": "string"},
                "requirements": {"bsonType": "array"},
                "featured": {"bsonType": "bool"},
                "status": {"enum": ["draft", "active", "closed"]},
                "created_at": {"bsonType": "date"},
            },
        }
    }
    try:
        await db.command({
            "collMod": "jobs",
            "validator": jobs_validator,
            "validationLevel": "moderate",
        })
    except Exception:
        pass

    # Applications
    try:
        await db.create_collection("applications")
    except Exception:
        pass
    await db.applications.create_index([("job_id", 1), ("status", 1)])
    await db.applications.create_index([("candidate.name", "text"), ("candidate.email", "text")])

    applications_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["job_id", "candidate", "applied_at"],
            "properties": {
                "job_id": {"bsonType": "string"},
                "candidate": {
                    "bsonType": "object",
                    "required": ["name", "email", "phone"],
                },
                "resume_media_id": {"bsonType": "string"},
                "cover_letter": {"bsonType": "string"},
                "status": {"enum": ["applied", "screening", "interview", "offered", "rejected"]},
                "notes": {"bsonType": "array"},
                "applied_at": {"bsonType": "date"},
            },
        }
    }
    try:
        await db.command({
            "collMod": "applications",
            "validator": applications_validator,
            "validationLevel": "moderate",
        })
    except Exception:
        pass

    # Media
    try:
        await db.create_collection("media")
    except Exception:
        pass
    await db.media.create_index("_id", unique=True)

    # Users
    try:
        await db.create_collection("users")
    except Exception:
        pass
    await db.users.create_index("email", unique=True)

    # Settings
    try:
        await db.create_collection("settings")
    except Exception:
        pass
    await db.settings.create_index("key", unique=True)

    # Audit Logs
    try:
        await db.create_collection("audit_logs")
    except Exception:
        pass
    await db.audit_logs.create_index([("model", 1), ("model_id", 1), ("created_at", -1)])

    # Pages
    try:
        await db.create_collection("pages")
    except Exception:
        pass
    await db.pages.create_index("slug", unique=True)


