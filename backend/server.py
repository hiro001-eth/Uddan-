from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
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

# Applications endpoints
@api_router.post("/applications", response_model=JobApplication)
async def create_application(application_data: ApplicationCreate):
    # Check if opportunity exists
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
    
    # Sample opportunities
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
            "title": "Data Scientist Position - Toronto",
            "description": "Exciting opportunity for Data Scientist role in leading tech company in Toronto.",
            "country": "Canada",
            "state": "Ontario",
            "job_type": "work",
            "requirements": ["Master's in Computer Science", "3+ years experience", "Python, R, SQL"],
            "salary_range": "CAD 80,000 - 120,000",
            "duration": "Full-time permanent"
        },
        {
            "title": "Business Analytics - London School of Economics",
            "description": "MBA in Business Analytics from prestigious LSE with industry partnerships.",
            "country": "United Kingdom",
            "state": "London",
            "job_type": "study",
            "requirements": ["Bachelor's degree", "GMAT 650+", "Work experience 2+ years"],
            "duration": "1 year",
            "salary_range": "GBP 50,000 - 80,000 post graduation"
        },
        {
            "title": "Nursing Opportunities - Auckland",
            "description": "Multiple nursing positions available in Auckland's top hospitals.",
            "country": "New Zealand",
            "state": "Auckland",
            "job_type": "work",
            "requirements": ["Nursing degree", "IELTS 7.0", "Registration required"],
            "salary_range": "NZD 65,000 - 85,000",
            "duration": "Full-time permanent"
        }
    ]
    
    for opp_data in sample_opportunities:
        opportunity = Opportunity(**opp_data)
        await db.opportunities.insert_one(opportunity.dict())
    
    # Sample testimonials
    sample_testimonials = [
        {
            "name": "Prabha Dhital",
            "position": "Visa Success, Canada",
            "content": "Embarking on my journey to study in Canada, I faced the challenge of finding the right consultancy. Google led me to Uddaan Consultancy, a beacon of guidance. Their personalized approach, expert advice, and seamless process made them the ideal choice.",
            "image_url": "https://images.unsplash.com/photo-1494790108755-2616b612681a?w=150&h=150&fit=crop&crop=face"
        },
        {
            "name": "Ved Thapa",
            "position": "Software Developer, Australia",
            "content": "I think that in the digital age, information is the driver. Uddaan Consultancy provided me with accurate information and guidance that helped me secure my dream job in Australia.",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            "name": "Sarah Johnson",
            "position": "Masters Graduate, UK",
            "content": "Uddaan Consultancy made my dream of studying in the UK a reality. Their comprehensive support and expertise guided me through every step of the process.",
            "image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
    ]
    
    for testimonial_data in sample_testimonials:
        testimonial = Testimonial(**testimonial_data)
        await db.testimonials.insert_one(testimonial.dict())
    
    # Sample university partners
    sample_partners = [
        {"name": "University of Melbourne", "country": "Australia", "logo_url": "https://via.placeholder.com/150x80/0073e6/ffffff?text=UoM"},
        {"name": "University of Toronto", "country": "Canada", "logo_url": "https://via.placeholder.com/150x80/002a5c/ffffff?text=UofT"},
        {"name": "London School of Economics", "country": "United Kingdom", "logo_url": "https://via.placeholder.com/150x80/8b0000/ffffff?text=LSE"},
        {"name": "Stanford University", "country": "United States", "logo_url": "https://via.placeholder.com/150x80/8c1515/ffffff?text=Stanford"},
        {"name": "University of Auckland", "country": "New Zealand", "logo_url": "https://via.placeholder.com/150x80/003366/ffffff?text=UoA"},
        {"name": "Technical University Munich", "country": "Germany", "logo_url": "https://via.placeholder.com/150x80/0065bd/ffffff?text=TUM"}
    ]
    
    for partner_data in sample_partners:
        partner = UniversityPartner(**partner_data)
        await db.partners.insert_one(partner.dict())
    
    return {"message": "Sample data initialized successfully"}

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