from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field, EmailStr


class JobStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"


class Job(BaseModel):
    id: str = Field(default_factory=lambda: "")
    slug: Optional[str] = None
    title: str
    description: Optional[str] = None
    company: Optional[Dict[str, Any]] = None
    country: str
    city: Optional[str] = None
    job_type: str
    salary: Optional[Dict[str, Any]] = None
    requirements: List[str] = Field(default_factory=list)
    featured: bool = False
    status: JobStatus = JobStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Candidate(BaseModel):
    name: str
    email: EmailStr
    phone: str


class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFERED = "offered"
    REJECTED = "rejected"


class Application(BaseModel):
    id: Optional[str] = None
    job_id: str
    candidate: Candidate
    resume_media_id: Optional[str] = None
    cover_letter: Optional[str] = None
    status: ApplicationStatus = ApplicationStatus.APPLIED
    notes: List[Dict[str, Any]] = Field(default_factory=list)
    applied_at: datetime = Field(default_factory=datetime.utcnow)


class Media(BaseModel):
    id: Optional[str] = None
    path: str
    mime: Optional[str] = None
    size: Optional[int] = None
    sensitive: bool = False
    storage_backend: str = "s3"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserRole(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    password_hash: str
    roles: List[UserRole] = Field(default_factory=lambda: [UserRole.ADMIN])
    mfa_enabled: bool = False
    mfa_secret_encrypted: Optional[Dict[str, str]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Setting(BaseModel):
    id: Optional[str] = None
    key: str
    value: Any
    category: Optional[str] = None
    description: Optional[str] = None
    is_public: bool = False


class AuditLog(BaseModel):
    id: Optional[str] = None
    model: str
    model_id: str
    action: str
    actor_user_id: Optional[str] = None
    meta: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Page(BaseModel):
    id: Optional[str] = None
    slug: str
    title: str
    content: str  # sanitized HTML/JSON
    status: str = "published"  # or draft
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


