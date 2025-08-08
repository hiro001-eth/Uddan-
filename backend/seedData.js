const mongoose = require('mongoose');
const Job = require('./models/Job');
const Testimonial = require('./models/Testimonial');
const Event = require('./models/Event');
const Setting = require('./models/Setting');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/uddaan-consultancy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleJobs = [
  {
    title: "Master of Computer Science",
    company: "University of Toronto",
    country: "Canada",
    jobType: "study",
    salary: "CA$28,500/year",
    description: "A comprehensive program covering advanced computer science concepts, machine learning, and software engineering. Students will gain hands-on experience with cutting-edge technologies and research opportunities.",
    requirements: ["GPA 3.5+", "IELTS 7.0", "GRE 320+", "Computer Science background"],
    contactEmail: "admissions@utoronto.ca",
    programType: "Master",
    duration: "2 years",
    tuitionFee: "CA$28,500/year",
    applicationDeadline: new Date("2025-01-15"),
    universityLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=center",
    universityWebsite: "https://www.utoronto.ca",
    scholarships: true,
    matchPercentage: 92,
    featured: true,
    seoTitle: "Master of Computer Science at University of Toronto",
    seoDescription: "Study Computer Science at University of Toronto. Top-ranked program with research opportunities and industry connections.",
    seoKeywords: ["computer science", "master degree", "toronto", "canada", "technology"]
  },
  {
    title: "Bachelor of Business Administration",
    company: "University of British Columbia",
    country: "Canada",
    jobType: "study",
    salary: "CA$35,000/year",
    description: "Develop strong business fundamentals with real-world applications. Learn from industry experts and gain international business perspectives.",
    requirements: ["GPA 3.0+", "IELTS 6.5", "High School Diploma", "Personal Statement"],
    contactEmail: "admissions@ubc.ca",
    programType: "Bachelor",
    duration: "4 years",
    tuitionFee: "CA$35,000/year",
    applicationDeadline: new Date("2025-03-01"),
    universityLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=center",
    universityWebsite: "https://www.ubc.ca",
    scholarships: true,
    matchPercentage: 88,
    featured: true,
    seoTitle: "Bachelor of Business Administration at UBC",
    seoDescription: "Start your business career with UBC's prestigious BBA program. Global opportunities await.",
    seoKeywords: ["business administration", "bachelor degree", "ubc", "canada", "business"]
  },
  {
    title: "Software Developer",
    company: "TechCorp Canada",
    country: "Canada",
    jobType: "work",
    salary: "CA$75,000 - CA$95,000",
    description: "Join our dynamic team developing cutting-edge software solutions. Work with modern technologies and contribute to innovative projects.",
    requirements: ["JavaScript", "React", "Node.js", "3+ years experience"],
    contactEmail: "hr@techcorp.ca",
    programType: "Work",
    duration: "Full-time",
    tuitionFee: "N/A",
    applicationDeadline: new Date("2025-02-28"),
    universityLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=center",
    universityWebsite: "https://www.techcorp.ca",
    scholarships: false,
    matchPercentage: 85,
    featured: true,
    seoTitle: "Software Developer Position at TechCorp Canada",
    seoDescription: "Exciting software development opportunity in Canada. Join a growing tech company.",
    seoKeywords: ["software developer", "canada", "tech", "programming", "job"]
  },
  {
    title: "PhD in Data Science",
    company: "University of Waterloo",
    country: "Canada",
    jobType: "study",
    salary: "Fully Funded",
    description: "Research-intensive program focusing on data science, machine learning, and artificial intelligence. Work with world-renowned researchers.",
    requirements: ["Master's Degree", "GPA 3.7+", "Research Experience", "GRE 325+"],
    contactEmail: "gradadmissions@uwaterloo.ca",
    programType: "PhD",
    duration: "4-6 years",
    tuitionFee: "Fully Funded",
    applicationDeadline: new Date("2025-01-10"),
    universityLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=center",
    universityWebsite: "https://www.uwaterloo.ca",
    scholarships: true,
    matchPercentage: 95,
    featured: true,
    seoTitle: "PhD in Data Science at University of Waterloo",
    seoDescription: "Pursue your PhD in Data Science at one of Canada's top research universities.",
    seoKeywords: ["phd", "data science", "waterloo", "canada", "research"]
  }
];

const sampleTestimonials = [
  {
    name: "Sarah Johnson",
    position: "Software Engineer",
    company: "Google Canada",
    country: "Canada",
    testimonial: "Uddaan Consultancy helped me secure my dream job at Google. Their guidance throughout the application process was invaluable. I highly recommend their services!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=center",
    featured: true,
    order: 1
  },
  {
    name: "Michael Chen",
    position: "Graduate Student",
    company: "University of Toronto",
    country: "Canada",
    testimonial: "Thanks to Uddaan, I got accepted into my dream Master's program. Their expertise in international education made the entire process smooth and stress-free.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
    featured: true,
    order: 2
  },
  {
    name: "Emily Rodriguez",
    position: "Business Analyst",
    company: "RBC",
    country: "Canada",
    testimonial: "Uddaan's professional approach and attention to detail helped me navigate the complex Canadian job market. I'm now working in my field of choice!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center",
    featured: true,
    order: 3
  }
];

const sampleEvents = [
  {
    title: "Study Abroad Workshop",
    description: "Learn everything you need to know about studying abroad in Canada. Get tips on applications, visas, and student life.",
    shortDescription: "Comprehensive workshop on studying abroad in Canada",
    eventType: "workshop",
    startDate: new Date("2024-12-15T10:00:00"),
    endDate: new Date("2024-12-15T16:00:00"),
    location: "Toronto, Canada",
    online: false,
    meetingLink: "",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop&crop=center",
    featured: true,
    registrationRequired: true,
    maxParticipants: 50,
    currentParticipants: 25,
    seoTitle: "Study Abroad Workshop - Toronto",
    seoDescription: "Join our comprehensive workshop on studying abroad in Canada",
    seoKeywords: ["study abroad", "workshop", "toronto", "canada", "education"]
  },
  {
    title: "Job Market Trends Webinar",
    description: "Stay updated with the latest trends in the Canadian job market. Learn about in-demand skills and career opportunities.",
    shortDescription: "Latest trends in Canadian job market",
    eventType: "webinar",
    startDate: new Date("2024-12-20T14:00:00"),
    endDate: new Date("2024-12-20T15:30:00"),
    location: "Online",
    online: true,
    meetingLink: "https://zoom.us/j/123456789",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center",
    featured: true,
    registrationRequired: true,
    maxParticipants: 100,
    currentParticipants: 45,
    seoTitle: "Canadian Job Market Trends Webinar",
    seoDescription: "Learn about the latest trends in the Canadian job market",
    seoKeywords: ["job market", "canada", "webinar", "career", "trends"]
  }
];

const sampleSettings = [
  {
    key: "company_name",
    value: "Uddaan Consultancy",
    category: "company",
    description: "Company name displayed on the website"
  },
  {
    key: "company_description",
    value: "Your Gateway to Global Opportunities - We help students and professionals find their dream opportunities worldwide through expert guidance and support.",
    category: "company",
    description: "Company description for SEO and display"
  },
  {
    key: "contact_email",
    value: "info@uddaanconsultancy.com",
    category: "contact",
    description: "Primary contact email"
  },
  {
    key: "contact_phone",
    value: "+1 (555) 123-4567",
    category: "contact",
    description: "Primary contact phone number"
  },
  {
    key: "contact_address",
    value: "123 Business Street, Toronto, ON, Canada",
    category: "contact",
    description: "Company address"
  },
  {
    key: "seo_title",
    value: "Uddaan Consultancy - Your Gateway to Global Opportunities",
    category: "seo",
    description: "Default SEO title"
  },
  {
    key: "seo_description",
    value: "Find your dream job or study opportunity worldwide with expert guidance from Uddaan Consultancy. Browse programs, apply online, and get professional support.",
    category: "seo",
    description: "Default SEO description"
  },
  {
    key: "seo_keywords",
    value: ["study abroad", "international education", "job opportunities", "canada", "immigration"],
    category: "seo",
    description: "Default SEO keywords"
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await Job.deleteMany({});
    await Testimonial.deleteMany({});
    await Event.deleteMany({});
    await Setting.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Insert sample data
    await Job.insertMany(sampleJobs);
    console.log('✅ Jobs seeded');

    await Testimonial.insertMany(sampleTestimonials);
    console.log('✅ Testimonials seeded');

    await Event.insertMany(sampleEvents);
    console.log('✅ Events seeded');

    await Setting.insertMany(sampleSettings);
    console.log('✅ Settings seeded');

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Seeded ${sampleJobs.length} jobs, ${sampleTestimonials.length} testimonials, ${sampleEvents.length} events, and ${sampleSettings.length} settings`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding
seedData(); 