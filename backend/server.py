from fastapi import FastAPI, APIRouter, HTTPException, Request, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Tuple
import uuid
import time
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class JobType(str, Enum):
    STUDY = "study"
    WORK = "work"
    BOTH = "both"

class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


# ------------------------------
# Realtime (WebSocket) hub
# ------------------------------
active_admin_clients: List[WebSocket] = []


async def broadcast_to_admins(event: str, payload: Dict[str, Any]) -> None:
    stale_clients: List[WebSocket] = []
    message = {"event": event, "data": payload}
    for ws in active_admin_clients:
        try:
            await ws.send_json(message)
        except Exception:
            stale_clients.append(ws)
    for ws in stale_clients:
        try:
            active_admin_clients.remove(ws)
        except ValueError:
            pass


@app.websocket("/admin/ws")
async def admin_ws(websocket: WebSocket):
    await websocket.accept()
    active_admin_clients.append(websocket)
    try:
        # Keep alive; echo pings
        while True:
            _ = await websocket.receive_text()
            await websocket.send_text("ok")
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in active_admin_clients:
            active_admin_clients.remove(websocket)

class Country(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    code: str
    flag_url: str
    study_available: bool = True
    work_available: bool = True

class Opportunity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    country: str
    state: Optional[str] = None
    job_type: JobType
    requirements: List[str] = []
    salary_range: Optional[str] = None
    duration: Optional[str] = None
    application_deadline: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class JobApplication(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    opportunity_id: str
    applicant_name: str
    email: str
    phone: str
    available_countries: List[str]
    cover_letter: Optional[str] = None
    status: ApplicationStatus = ApplicationStatus.PENDING
    applied_at: datetime = Field(default_factory=datetime.utcnow)


# ------------------------------
# Jobs and Applications (public API)
# ------------------------------

class JobPublic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    country: str
    city: Optional[str] = None
    job_type: str
    description: Optional[str] = None
    requirements: List[str] = []
    company: Optional[Dict[str, Any]] = None
    featured: bool = False
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ApplicationPublicCreate(BaseModel):
    name: str
    email: str
    phone: str
    cover_letter: Optional[str] = None
    resume_media_id: Optional[str] = None


@api_router.get("/jobs", response_model=List[JobPublic])
async def get_jobs(country: Optional[str] = None, job_type: Optional[str] = None, q: Optional[str] = None):
    query: Dict[str, Any] = {"status": "active"}
    if country:
        query["country"] = country
    if job_type:
        query["job_type"] = job_type
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"company.name": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.jobs.find(query).sort([("featured", -1), ("created_at", -1)]).to_list(100)
    return [JobPublic(**{**d, "id": d.get("id", d.get("_id", ""))}) for d in docs]


@api_router.get("/jobs/{job_id}", response_model=JobPublic)
async def get_job(job_id: str):
    doc = await db.jobs.find_one({"id": job_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobPublic(**{**doc, "id": doc.get("id", job_id)})


# Simple in-memory rate limiter per IP and key
_rate_state: Dict[Tuple[str, str], List[float]] = {}


def rate_limit(request: Request, key: str, limit: int = 10, window_seconds: int = 60) -> None:
    now = time.monotonic()
    ip = request.client.host if request.client else "unknown"
    rk = (key, ip)
    bucket = _rate_state.get(rk, [])
    # drop old
    bucket = [t for t in bucket if now - t <= window_seconds]
    if len(bucket) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests, slow down")
    bucket.append(now)
    _rate_state[rk] = bucket

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    content: str
    image_url: str
    rating: int = 5
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UniversityPartner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    logo_url: str
    website_url: Optional[str] = None
    is_active: bool = True

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    author: str
    image_url: str
    tags: List[str] = []
    published_at: datetime = Field(default_factory=datetime.utcnow)
    is_published: bool = True

# Create Models for requests
class OpportunityCreate(BaseModel):
    title: str
    description: str
    country: str
    state: Optional[str] = None
    job_type: JobType
    requirements: List[str] = []
    salary_range: Optional[str] = None
    duration: Optional[str] = None
    application_deadline: Optional[datetime] = None

class ApplicationCreate(BaseModel):
    opportunity_id: str
    applicant_name: str
    email: str
    phone: str
    available_countries: List[str]
    cover_letter: Optional[str] = None

class OpportunitySearch(BaseModel):
    country: Optional[str] = None
    state: Optional[str] = None
    job_type: Optional[JobType] = None
    search_query: Optional[str] = None

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "Uddaan Consultancy API"}

# AI assistant models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@api_router.post('/ai/chat', response_model=ChatResponse)
async def ai_chat(req: ChatRequest):
    text = req.message.lower()
    if 'job' in text or 'vacanc' in text:
        return ChatResponse(reply='We list Gulf country jobs on our Jobs page. Filter by country like UAE, Qatar, or Saudi Arabia and apply directly. Would you like a link?')
    if 'consult' in text or 'book' in text:
        return ChatResponse(reply='You can schedule a 1:1 consultation from the Consultation page. Pick a date and time that works for you!')
    if 'visa' in text:
        return ChatResponse(reply='We assist with visa documentation and process guidance after your job application is accepted.')
    if 'contact' in text or 'support' in text:
        return ChatResponse(reply='Reach us via the Contact page, phone +977-1-4444444, or email info@uddaanconsultancy.com.')
    return ChatResponse(reply='I can help with jobs, consultation booking, and visa guidance. What would you like to do?')

# Countries endpoints
@api_router.get("/countries", response_model=List[Country])
async def get_countries():
    countries = await db.countries.find().to_list(1000)
    return [Country(**country) for country in countries]

@api_router.post("/countries", response_model=Country)
async def create_country(country_data: Country):
    country_dict = country_data.dict()
    await db.countries.insert_one(country_dict)
    return country_data

# Opportunities endpoints
@api_router.get("/opportunities", response_model=List[Opportunity])
async def get_opportunities(
    country: Optional[str] = None,
    job_type: Optional[JobType] = None,
    search_query: Optional[str] = None
):
    filter_query = {"is_active": True}
    
    if country:
        filter_query["country"] = country
    if job_type:
        filter_query["job_type"] = job_type
    if search_query:
        filter_query["$or"] = [
            {"title": {"$regex": search_query, "$options": "i"}},
            {"description": {"$regex": search_query, "$options": "i"}}
        ]
    
    opportunities = await db.opportunities.find(filter_query).to_list(1000)
    return [Opportunity(**opp) for opp in opportunities]

@api_router.post("/opportunities", response_model=Opportunity)
async def create_opportunity(opportunity_data: OpportunityCreate):
    opportunity_dict = opportunity_data.dict()
    opportunity = Opportunity(**opportunity_dict)
    await db.opportunities.insert_one(opportunity.dict())
    return opportunity

@api_router.get("/opportunities/{opportunity_id}", response_model=Opportunity)
async def get_opportunity(opportunity_id: str):
    opportunity = await db.opportunities.find_one({"id": opportunity_id})
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return Opportunity(**opportunity)

# Applications endpoints (legacy for opportunities)
@api_router.post("/applications", response_model=JobApplication)
async def create_application(application_data: ApplicationCreate):
    opportunity = await db.opportunities.find_one({"id": application_data.opportunity_id})
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    application_dict = application_data.dict()
    application = JobApplication(**application_dict)
    await db.applications.insert_one(application.dict())
    return application

@api_router.get("/applications", response_model=List[JobApplication])
async def get_applications():
    applications = await db.applications.find().to_list(1000)
    return [JobApplication(**app) for app in applications]

@api_router.get("/applications/{application_id}", response_model=JobApplication)
async def get_application(application_id: str):
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return JobApplication(**application)


# Public apply endpoint for jobs
@api_router.post("/jobs/{job_id}/apply")
async def apply_to_job(job_id: str, payload: ApplicationPublicCreate, request: Request):
    rate_limit(request, key="apply", limit=5, window_seconds=60)
    job = await db.jobs.find_one({"id": job_id, "status": {"$ne": "closed"}})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or closed")
    app_doc = {
        "job_id": job_id,
        "candidate": {
            "name": payload.name,
            "email": payload.email,
            "phone": payload.phone,
        },
        "resume_media_id": payload.resume_media_id,
        "cover_letter": payload.cover_letter,
        "status": "applied",
        "applied_at": datetime.utcnow(),
        "notes": [],
    }
    await db.applications.insert_one(app_doc)
    # emit realtime event for admin
    safe_payload = {
        "job_id": job_id,
        "candidate": {"name": payload.name, "email": payload.email, "phone": payload.phone},
        "applied_at": app_doc["applied_at"].isoformat() + "Z",
        "status": "applied",
    }
    await broadcast_to_admins("application:new", safe_payload)
    return {"ok": True}


# ------------------------------
# Media presign upload (S3/MinIO)
# ------------------------------
import boto3


def get_s3_client():
    endpoint_url = os.getenv("S3_ENDPOINT_URL")
    region = os.getenv("S3_REGION", "us-east-1")
    return boto3.client(
        "s3",
        endpoint_url=endpoint_url if endpoint_url else None,
        region_name=region,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        config=boto3.session.Config(signature_version="s3v4"),
    )


@api_router.post("/media/presign-upload")
async def presign_upload(request: Request, filename: str, mime: str, size: Optional[int] = None, purpose: Optional[str] = None):
    rate_limit(request, key="presign", limit=10, window_seconds=60)
    bucket = os.getenv("S3_BUCKET")
    if not bucket:
        raise HTTPException(status_code=500, detail="S3 bucket not configured")
    s3 = get_s3_client()
    # create media record first
    media_id = str(uuid.uuid4())
    key = f"uploads/{media_id}/{filename}"
    path = f"s3://{bucket}/{key}"
    media_doc = {
        "_id": media_id,
        "path": path,
        "mime": mime,
        "size": size,
        "sensitive": True if purpose == "resume" else False,
        "storage_backend": "s3",
        "created_at": datetime.utcnow(),
    }
    await db.media.insert_one(media_doc)
    try:
        url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={"Bucket": bucket, "Key": key, "ContentType": mime},
            ExpiresIn=900,  # 15 minutes
        )
    except Exception as e:
        # cleanup media doc if presign fails
        await db.media.delete_one({"_id": media_id})
        raise HTTPException(status_code=500, detail=f"Failed to create presigned URL: {e}")
    return {"upload_url": url, "media_id": media_id, "path": path}

# Testimonials endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({"is_active": True}).to_list(100)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: Testimonial):
    testimonial_dict = testimonial_data.dict()
    await db.testimonials.insert_one(testimonial_dict)
    return testimonial_data

# University Partners endpoints
@api_router.get("/partners", response_model=List[UniversityPartner])
async def get_partners():
    partners = await db.partners.find({"is_active": True}).to_list(100)
    return [UniversityPartner(**partner) for partner in partners]

@api_router.post("/partners", response_model=UniversityPartner)
async def create_partner(partner_data: UniversityPartner):
    partner_dict = partner_data.dict()
    await db.partners.insert_one(partner_dict)
    return partner_data

# Blog endpoints
@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({"is_published": True}).to_list(100)
    return [BlogPost(**post) for post in posts]

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post_data: BlogPost):
    post_dict = post_data.dict()
    await db.blog_posts.insert_one(post_dict)
    return post_data

# Initialize sample data
@api_router.post("/init-data")
async def initialize_sample_data():
    # Sample countries including Gulf countries
    sample_countries = [
        {"name": "Australia", "code": "AU", "flag_url": "https://flagcdn.com/au.svg"},
        {"name": "Canada", "code": "CA", "flag_url": "https://flagcdn.com/ca.svg"},
        {"name": "United Kingdom", "code": "GB", "flag_url": "https://flagcdn.com/gb.svg"},
        {"name": "United States", "code": "US", "flag_url": "https://flagcdn.com/us.svg"},
        {"name": "New Zealand", "code": "NZ", "flag_url": "https://flagcdn.com/nz.svg"},
        {"name": "Germany", "code": "DE", "flag_url": "https://flagcdn.com/de.svg"},
        {"name": "France", "code": "FR", "flag_url": "https://flagcdn.com/fr.svg"},
        {"name": "Netherlands", "code": "NL", "flag_url": "https://flagcdn.com/nl.svg"},
        {"name": "United Arab Emirates", "code": "AE", "flag_url": "https://flagcdn.com/ae.svg"},
        {"name": "Saudi Arabia", "code": "SA", "flag_url": "https://flagcdn.com/sa.svg"},
        {"name": "Qatar", "code": "QA", "flag_url": "https://flagcdn.com/qa.svg"},
        {"name": "Kuwait", "code": "KW", "flag_url": "https://flagcdn.com/kw.svg"},
        {"name": "Bahrain", "code": "BH", "flag_url": "https://flagcdn.com/bh.svg"},
        {"name": "Oman", "code": "OM", "flag_url": "https://flagcdn.com/om.svg"},
        {"name": "Singapore", "code": "SG", "flag_url": "https://flagcdn.com/sg.svg"},
        {"name": "Japan", "code": "JP", "flag_url": "https://flagcdn.com/jp.svg"},
    ]
    
    for country_data in sample_countries:
        country = Country(**country_data)
        await db.countries.insert_one(country.dict())
    
    # Sample opportunities including Gulf countries work opportunities
    sample_opportunities = [
        {
            "title": "Software Engineering - Melbourne University",
            "description": "Master's in Software Engineering at top Australian university with excellent placement opportunities.",
            "country": "Australia",
            "state": "Victoria",
            "job_type": "study",
            "requirements": ["Bachelor's degree", "IELTS 6.5", "Statement of Purpose"],
            "duration": "2 years",
            "salary_range": "AUD 60,000 - 90,000 post graduation"
        },
        {
            "title": "Engineering Jobs - Dubai",
            "description": "Exciting engineering opportunities in Dubai's booming construction and tech sectors.",
            "country": "United Arab Emirates",
            "state": "Dubai",
            "job_type": "work",
            "requirements": ["Engineering degree", "3+ years experience", "UAE visa processing"],
            "salary_range": "AED 15,000 - 25,000",
            "duration": "2-3 year contracts"
        },
    ]
    
    for opp_data in sample_opportunities:
        opportunity = Opportunity(**opp_data)
        await db.opportunities.insert_one(opportunity.dict())
    
    # Sample testimonials
    sample_testimonials = [
        {
            "name": "Prabha Dhital",
            "position": "Visa Success, Canada",
            "content": "Embarking on my journey...",
            "image_url": "https://images.unsplash.com/photo-1494790108755-2616b612681a?w=150&h=150&fit=crop&crop=face"
        }
    ]
    
    for testimonial_data in sample_testimonials:
        testimonial = Testimonial(**testimonial_data)
        await db.testimonials.insert_one(testimonial.dict())
    
    return {"message": "Sample data initialized successfully"}


async def ensure_indexes_and_validators() -> None:
    # Indexes for jobs
    try:
        await db.jobs.create_index("id", unique=True)
        await db.jobs.create_index([("country", 1), ("job_type", 1), ("status", 1), ("featured", -1)])
        await db.jobs.create_index([("title", "text"), ("description", "text"), ("company.name", "text")])
    except Exception as e:
        logger.warning(f"jobs index creation issue: {e}")

    # Indexes for applications
    try:
        await db.applications.create_index([("job_id", 1), ("status", 1)])
        await db.applications.create_index([("candidate.name", "text"), ("candidate.email", "text")])
    except Exception as e:
        logger.warning(f"applications index creation issue: {e}")

    # Best-effort validators (collMod may require privileges)
    jobs_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["title", "country", "status", "created_at"],
            "properties": {
                "title": {"bsonType": "string"},
                "slug": {"bsonType": "string"},
                "company": {
                    "bsonType": "object",
                    "properties": {
                        "name": {"bsonType": "string"},
                        "logo_media_id": {"bsonType": "string"},
                    },
                },
                "country": {"bsonType": "string"},
                "city": {"bsonType": "string"},
                "job_type": {"enum": ["full-time", "part-time", "contract", "temporary", "work", "study", "both"]},
                "salary": {
                    "bsonType": "object",
                    "properties": {
                        "min": {"bsonType": ["int", "long", "double"]},
                        "max": {"bsonType": ["int", "long", "double"]},
                        "currency": {"bsonType": "string"},
                    },
                },
                "description": {"bsonType": "string"},
                "requirements": {"bsonType": "array", "items": {"bsonType": "string"}},
                "featured": {"bsonType": "bool"},
                "status": {"enum": ["draft", "active", "closed"]},
                "created_at": {"bsonType": "date"},
            },
        }
    }
    applications_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["job_id", "candidate", "applied_at"],
            "properties": {
                "job_id": {"bsonType": "string"},
                "candidate": {
                    "bsonType": "object",
                    "required": ["name", "email", "phone"],
                    "properties": {
                        "name": {"bsonType": "string"},
                        "email": {"bsonType": "string"},
                        "phone": {"bsonType": "string"},
                    },
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
        await db.create_collection("jobs")
    except Exception:
        pass
    try:
        await db.command({
            "collMod": "jobs",
            "validator": jobs_validator,
            "validationLevel": "moderate",
        })
    except Exception as e:
        logger.warning(f"jobs validator issue: {e}")
    try:
        await db.create_collection("applications")
    except Exception:
        pass
    try:
        await db.command({
            "collMod": "applications",
            "validator": applications_validator,
            "validationLevel": "moderate",
        })
    except Exception as e:
        logger.warning(f"applications validator issue: {e}")


@app.on_event("startup")
async def on_startup():
    await ensure_indexes_and_validators()

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()