from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from .db import connect_to_mongo
from .redis_store import get_session
from .config import settings


router = APIRouter(prefix="/admin/api/db", tags=["admin-db"])


WHITELISTED_COLLECTIONS = {
    "jobs",
    "applications",
    "media",
    "users",
    "settings",
    "audit_logs",
    "pages",
}


async def require_admin(request: Request) -> Dict[str, Any]:
    sid = request.cookies.get(settings.session_cookie_name)
    if sid:
        session = await get_session(sid)
        if session and "roles" in session and "admin" in session["roles"]:
            return session
    # fallback header for initial bootstrap only
    token = request.headers.get("x-admin-token")
    if token and token == settings.secret_key:
        return {"user_id": "bootstrap", "roles": ["admin"]}
    raise HTTPException(status_code=401, detail="Unauthorized")


class QueryRequest(BaseModel):
    collection: str
    filter: Dict[str, Any] = {}
    projection: Optional[Dict[str, int]] = None
    sort: Optional[List[List[Any]]] = None
    limit: int = 50
    skip: int = 0


@router.post("/find")
async def admin_find(payload: QueryRequest, _admin=Depends(require_admin)) -> Dict[str, Any]:
    if payload.collection not in WHITELISTED_COLLECTIONS:
        raise HTTPException(status_code=400, detail="Collection not allowed")
    db = await connect_to_mongo()
    cursor = db[payload.collection].find(payload.filter, payload.projection)
    if payload.sort:
        cursor = cursor.sort(payload.sort)  # type: ignore[arg-type]
    docs = await cursor.skip(payload.skip).limit(payload.limit).to_list(length=payload.limit)
    return {"items": docs}


class InsertOneRequest(BaseModel):
    collection: str
    document: Dict[str, Any]


@router.post("/insertOne")
async def admin_insert_one(payload: InsertOneRequest, _admin=Depends(require_admin)) -> Dict[str, Any]:
    if payload.collection not in WHITELISTED_COLLECTIONS:
        raise HTTPException(status_code=400, detail="Collection not allowed")
    db = await connect_to_mongo()
    res = await db[payload.collection].insert_one(payload.document)
    return {"inserted_id": str(res.inserted_id)}


class UpdateOneRequest(BaseModel):
    collection: str
    filter: Dict[str, Any]
    update: Dict[str, Any]


@router.post("/updateOne")
async def admin_update_one(payload: UpdateOneRequest, _admin=Depends(require_admin)) -> Dict[str, Any]:
    if payload.collection not in WHITELISTED_COLLECTIONS:
        raise HTTPException(status_code=400, detail="Collection not allowed")
    db = await connect_to_mongo()
    res = await db[payload.collection].update_one(payload.filter, payload.update)
    return {"matched": res.matched_count, "modified": res.modified_count}


class DeleteOneRequest(BaseModel):
    collection: str
    filter: Dict[str, Any]


@router.post("/deleteOne")
async def admin_delete_one(payload: DeleteOneRequest, _admin=Depends(require_admin)) -> Dict[str, Any]:
    if payload.collection not in WHITELISTED_COLLECTIONS:
        raise HTTPException(status_code=400, detail="Collection not allowed")
    db = await connect_to_mongo()
    res = await db[payload.collection].delete_one(payload.filter)
    return {"deleted": res.deleted_count}


