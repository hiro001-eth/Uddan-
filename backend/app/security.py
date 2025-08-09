from __future__ import annotations

import base64
import os
import time
from typing import Any, Dict

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def _get_key() -> bytes:
    key_b64 = os.getenv("FLE_MASTER_KEY")
    if key_b64 and len(key_b64) >= 44:  # likely base64
        try:
            return base64.b64decode(key_b64)
        except Exception:
            pass
    key = (os.getenv("FLE_MASTER_KEY", "dev-32-byte-key-please-change").encode("utf-8"))
    if len(key) < 32:
        key = key.ljust(32, b"0")
    return key[:32]


def aes_gcm_encrypt(plaintext: bytes, aad: bytes | None = None) -> Dict[str, str]:
    key = _get_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, plaintext, aad)
    return {
        "n": base64.b64encode(nonce).decode(),
        "ct": base64.b64encode(ct).decode(),
    }


def aes_gcm_decrypt(payload: Dict[str, str], aad: bytes | None = None) -> bytes:
    key = _get_key()
    aesgcm = AESGCM(key)
    nonce = base64.b64decode(payload["n"])  # type: ignore[arg-type]
    ct = base64.b64decode(payload["ct"])  # type: ignore[arg-type]
    return aesgcm.decrypt(nonce, ct, aad)


def now_seconds() -> int:
    return int(time.time())


