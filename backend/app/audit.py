from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from .db import connect_to_mongo


async def write_audit_log(model: str, model_id: str, action: str, actor_user_id: Optional[str], meta: Dict[str, Any] | None = None) -> None:
    db = await connect_to_mongo()
    await db.audit_logs.insert_one(
        {
            "model": model,
            "model_id": model_id,
            "action": action,
            "actor_user_id": actor_user_id,
            "meta": meta or {},
            "created_at": datetime.utcnow(),
        }
    )


