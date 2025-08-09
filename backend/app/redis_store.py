from __future__ import annotations

import json
from typing import Any, Dict, Optional

from redis import asyncio as aioredis
from .config import settings


redis_client: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)
    return redis_client


async def set_session(session_id: str, data: Dict[str, Any], ttl_seconds: int | None = None) -> None:
    r = await get_redis()
    ttl = ttl_seconds or settings.session_ttl_seconds
    await r.setex(f"session:{session_id}", ttl, json.dumps(data))


async def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    r = await get_redis()
    raw = await r.get(f"session:{session_id}")
    if not raw:
        return None
    return json.loads(raw)


async def delete_session(session_id: str) -> None:
    r = await get_redis()
    await r.delete(f"session:{session_id}")


async def publish(channel: str, message: Dict[str, Any]) -> None:
    r = await get_redis()
    await r.publish(channel, json.dumps(message))


