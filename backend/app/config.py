from pydantic import BaseModel
import os


class Settings(BaseModel):
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    mongo_db: str = os.getenv("DB_NAME", "uddaan")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    secret_key: str = os.getenv("SECRET_KEY", "change-me")
    jwt_secret: str = os.getenv("JWT_SECRET", "change-me-jwt")
    session_cookie_name: str = os.getenv("SESSION_COOKIE_NAME", "udaan_session")
    session_ttl_seconds: int = int(os.getenv("SESSION_TTL_SECONDS", "604800"))  # 7 days
    ws_token_ttl_seconds: int = int(os.getenv("WS_TOKEN_TTL_SECONDS", "300"))  # 5 minutes
    s3_endpoint_url: str | None = os.getenv("S3_ENDPOINT_URL")
    s3_region: str = os.getenv("S3_REGION", "us-east-1")
    s3_bucket: str | None = os.getenv("S3_BUCKET")
    aws_access_key_id: str | None = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str | None = os.getenv("AWS_SECRET_ACCESS_KEY")
    fle_master_key: str = os.getenv("FLE_MASTER_KEY", "dev-32-byte-key-please-change")
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")


settings = Settings()


