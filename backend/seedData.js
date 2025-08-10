
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Role = require('./models/Role');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Testimonial = require('./models/Testimonial');
const Event = require('./models/Event');
const Setting = require('./models/Setting');
const Page = require('./models/Page');

const sampleJobs = [
  {
    title: "Software Engineer",
    company: "TechCorp Dubai",
    country: "UAE",
    city: "Dubai",
    jobType: "Full-time",
    category: "IT",
    salaryMin: 4000,
    salaryMax: 6000,
    currency: "USD",
    description: "We are looking for a skilled Software Engineer to join our dynamic team in Dubai. Experience with React, Node.js, and cloud technologies required. You will be working on cutting-edge projects that impact millions of users worldwide.",
    requirements: [
      "3+ years experience in software development",
      "Proficiency in React and Node.js",
      "Experience with cloud platforms (AWS/Azure)",
      "Strong problem-solving skills",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Health insurance",
      "Annual bonus",
      "Visa sponsorship",
      "Transportation allowance",
      "Professional development budget"
    ],
    experienceLevel: "Mid Level",
    education: "Bachelor",
    contactEmail: "hr@techcorp-dubai.com",
    contactPhone: "+971-4-123-4567",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    featured: true,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: false,
    transportationProvided: true,
    tags: ["React", "Node.js", "AWS", "Remote Work", "Tech"]
  },
  {
    title: "Marketing Manager",
    company: "Global Retail Qatar",
    country: "Qatar",
    city: "Doha",
    jobType: "Full-time",
    category: "Marketing",
    salaryMin: 3500,
    salaryMax: 5000,
    currency: "USD",
    description: "Join our marketing team in Doha. Lead digital marketing campaigns and brand development for our retail operations across Qatar. Perfect opportunity for a creative marketing professional.",
    requirements: [
      "5+ years experience in digital marketing",
      "Proven track record in team leadership",
      "Experience with social media advertising",
      "Strong analytical skills",
      "Master's degree preferred"
    ],
    benefits: [
      "Competitive salary",
      "Housing allowance",
      "Annual leave tickets",
      "Medical insurance",
      "Career advancement opportunities"
    ],
    experienceLevel: "Senior Level",
    education: "Master",
    contactEmail: "careers@globalretail-qatar.com",
    contactPhone: "+974-4444-5555",
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    featured: true,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: true,
    transportationProvided: true,
    tags: ["Digital Marketing", "Leadership", "Retail", "Qatar"]
  },
  {
    title: "Accountant",
    company: "Finance Solutions Saudi",
    country: "Saudi Arabia",
    city: "Riyadh",
    jobType: "Full-time",
    category: "Finance",
    salaryMin: 3000,
    salaryMax: 4500,
    currency: "USD",
    description: "Experienced accountant needed for our Riyadh office. Handle financial reporting, tax compliance, and budgeting for our growing company. Great opportunity for career growth.",
    requirements: [
      "CPA or ACCA certification required",
      "3+ years experience in accounting",
      "Knowledge of SAP or similar ERP systems",
      "Strong attention to detail",
      "Arabic language skills preferred"
    ],
    benefits: [
      "Tax-free salary",
      "Health insurance",
      "Annual bonus",
      "Professional certification support",
      "Family visa sponsorship"
    ],
    experienceLevel: "Mid Level",
    education: "Bachelor",
    contactEmail: "hr@financesolutions-ksa.com",
    contactPhone: "+966-11-123-4567",
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    featured: false,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: false,
    transportationProvided: true,
    tags: ["Accounting", "SAP", "CPA", "ACCA", "Finance"]
  },
  {
    title: "Registered Nurse",
    company: "Medical Center Kuwait",
    country: "Kuwait",
    city: "Kuwait City",
    jobType: "Full-time",
    category: "Healthcare",
    salaryMin: 2500,
    salaryMax: 4000,
    currency: "USD",
    description: "Registered nurses needed for our state-of-the-art medical facility in Kuwait City. Excellent benefits and career growth opportunities in a modern healthcare environment.",
    requirements: [
      "BSN degree in Nursing",
      "2+ years clinical experience",
      "Valid nursing license",
      "CPR certification",
      "English fluency required"
    ],
    benefits: [
      "Competitive salary",
      "Medical insurance",
      "Housing provided",
      "Annual leave tickets",
      "Continuing education support"
    ],
    experienceLevel: "Mid Level",
    education: "Bachelor",
    contactEmail: "nursing@medcenter-kuwait.com",
    contactPhone: "+965-2222-3333",
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    featured: false,
    urgent: true,
    workPermitSponsorship: true,
    accommodationProvided: true,
    transportationProvided: true,
    tags: ["Nursing", "Healthcare", "Medical", "BSN", "Clinical"]
  },
  {
    title: "Construction Supervisor",
    company: "BuildCorp Oman",
    country: "Oman",
    city: "Muscat",
    jobType: "Full-time",
    category: "Construction",
    salaryMin: 2800,
    salaryMax: 4200,
    currency: "USD",
    description: "Supervise construction projects in Muscat. Manage teams, ensure safety standards, and coordinate with clients and contractors. Excellent opportunity for experienced construction professionals.",
    requirements: [
      "Civil Engineering degree",
      "5+ years construction experience",
      "Safety certification (NEBOSH preferred)",
      "Project management skills",
      "Experience with construction software"
    ],
    benefits: [
      "Project bonuses",
      "Safety incentives",
      "Health insurance",
      "Transportation provided",
      "Career advancement"
    ],
    experienceLevel: "Senior Level",
    education: "Bachelor",
    contactEmail: "projects@buildcorp-oman.com",
    contactPhone: "+968-2444-5555",
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    featured: false,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: false,
    transportationProvided: true,
    tags: ["Construction", "Civil Engineering", "Safety", "Management"]
  },
  {
    title: "Hotel Manager",
    company: "Luxury Hotels Bahrain",
    country: "Bahrain",
    city: "Manama",
    jobType: "Full-time",
    category: "Hospitality",
    salaryMin: 3200,
    salaryMax: 4800,
    currency: "USD",
    description: "Manage operations for our luxury hotel in Manama. Oversee staff, guest services, and ensure exceptional customer experience. Perfect for hospitality professionals.",
    requirements: [
      "Hospitality Management degree",
      "3+ years management experience",
      "Customer service excellence",
      "Multi-language skills preferred",
      "PMS system experience"
    ],
    benefits: [
      "Performance bonuses",
      "Staff accommodation",
      "Meals provided",
      "Health insurance",
      "Career development"
    ],
    experienceLevel: "Mid Level",
    education: "Bachelor",
    contactEmail: "careers@luxuryhotels-bahrain.com",
    contactPhone: "+973-1234-5678",
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    featured: false,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: true,
    transportationProvided: false,
    tags: ["Hospitality", "Management", "Customer Service", "Hotel"]
  },
  {
    title: "Sales Executive",
    company: "Tech Solutions UAE",
    country: "UAE",
    city: "Dubai",
    jobType: "Full-time",
    category: "Sales",
    salaryMin: 2500,
    salaryMax: 4000,
    currency: "USD",
    description: "Drive sales for our technology solutions in Dubai. Build client relationships and achieve sales targets in the competitive tech market. Excellent commission structure.",
    requirements: [
      "2+ years sales experience",
      "Technology knowledge",
      "Excellent communication skills",
      "CRM system experience",
      "Target-driven mindset"
    ],
    benefits: [
      "High commission rates",
      "Sales bonuses",
      "Car allowance",
      "Health insurance",
      "Incentive trips"
    ],
    experienceLevel: "Mid Level",
    education: "Bachelor",
    contactEmail: "sales@techsolutions-uae.com",
    contactPhone: "+971-4-987-6543",
    applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    featured: false,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: false,
    transportationProvided: true,
    tags: ["Sales", "Technology", "CRM", "B2B", "Commission"]
  },
  {
    title: "International School Teacher",
    company: "International School Qatar",
    country: "Qatar",
    city: "Doha",
    jobType: "Full-time",
    category: "Education",
    salaryMin: 3000,
    salaryMax: 4500,
    currency: "USD",
    description: "Join our international school in Doha. Teach English, Math, or Science to diverse student body. Excellent benefits and professional development opportunities.",
    requirements: [
      "Teaching degree required",
      "2+ years teaching experience",
      "English fluency",
      "International curriculum experience",
      "Teaching certification"
    ],
    benefits: [
      "Tax-free salary",
      "Housing allowance",
      "Annual leave tickets",
      "Professional development",
      "Family education discounts"
    ],
    experienceLevel: "Mid Level",
    education: "Bachelor",
    contactEmail: "hr@intschool-qatar.edu",
    contactPhone: "+974-4444-7777",
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    featured: false,
    urgent: false,
    workPermitSponsorship: true,
    accommodationProvided: true,
    transportationProvided: true,
    tags: ["Teaching", "Education", "International", "Curriculum"]
  }
];

const sampleTestimonials = [
  {
    name: "Ahmed Hassan",
    position: "Software Engineer at TechCorp Dubai",
    content: "Uddaan Consultancy helped me land my dream job in Dubai. Their professional guidance and support throughout the process was exceptional. Highly recommended!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    company: "TechCorp Dubai",
    location: "UAE",
    featured: true,
    isActive: true,
    jobCategory: "IT"
  },
  {
    name: "Sarah Johnson",
    position: "Marketing Manager at Global Retail Qatar",
    content: "The team at Uddaan was incredibly professional and helped me secure a fantastic position in Qatar. Their market knowledge is unparalleled.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    company: "Global Retail Qatar",
    location: "Qatar",
    featured: true,
    isActive: true,
    jobCategory: "Marketing"
  },
  {
    name: "Mohammed Al-Rashid",
    position: "Accountant at Finance Solutions Saudi",
    content: "Professional service from start to finish. They understood my requirements and matched me with the perfect opportunity in Riyadh.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    company: "Finance Solutions Saudi",
    location: "Saudi Arabia",
    featured: false,
    isActive: true,
    jobCategory: "Finance"
  }
];

const sampleEvents = [
  {
    title: "Gulf Career Fair 2024",
    description: "Meet top employers from across the Gulf region. Network with industry leaders and explore career opportunities.",
    eventType: "career_fair",
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    location: "Dubai World Trade Centre, UAE",
    capacity: 500,
    registeredCount: 342,
    price: 0,
    featured: true,
    isActive: true,
    organizer: "Uddaan Consultancy",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop"
  },
  {
    title: "Resume Writing Workshop",
    description: "Learn how to create a compelling resume that gets noticed by Gulf employers. Interactive workshop with expert guidance.",
    eventType: "workshop",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: "Online via Zoom",
    capacity: 100,
    registeredCount: 78,
    price: 25,
    featured: false,
    isActive: true,
    organizer: "Uddaan Consultancy",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop"
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uddaan-consultancy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Testimonial.deleteMany({});
    await Event.deleteMany({});

    // Create roles
    console.log('👥 Creating roles...');
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      description: 'Full system access',
      permissions: ['all'],
      isSystem: true
    });

    const adminRole = await Role.create({
      name: 'Admin',
      description: 'Administrative access',
      permissions: [
        'dashboard.view', 'jobs.create', 'jobs.read', 'jobs.update', 'jobs.delete',
        'applications.read', 'applications.update', 'events.create', 'events.read',
        'events.update', 'testimonials.create', 'testimonials.read', 'testimonials.update',
        'media.upload', 'media.read', 'settings.read'
      ],
      isSystem: true
    });

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('uddaan123', 12);
    await User.create({
      name: 'Super Admin',
      email: 'admin@uddaan.com',
      password: hashedPassword,
      roleId: superAdminRole._id,
      isActive: true
    });

    // Create sample jobs
    console.log('💼 Creating sample jobs...');
    const createdJobs = await Job.insertMany(sampleJobs);
    
    // Add views and applications to jobs
    for (let job of createdJobs) {
      job.views = Math.floor(Math.random() * 300) + 50;
      job.applications = Math.floor(Math.random() * 25) + 5;
      await job.save();
    }

    // Create sample applications
    console.log('📄 Creating sample applications...');
    const sampleApplications = [
      {
        jobId: createdJobs[0]._id,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        phone: "+1-555-123-4567",
        nationality: "American",
        currentLocation: { country: "USA", city: "New York" },
        currentJobTitle: "Frontend Developer",
        currentCompany: "Tech Solutions Inc",
        totalExperience: { years: 3, months: 6 },
        status: "new",
        priority: "medium"
      },
      {
        jobId: createdJobs[1]._id,
        firstName: "Sarah",
        lastName: "Smith",
        email: "sarah.smith@email.com",
        phone: "+44-20-7946-0958",
        nationality: "British",
        currentLocation: { country: "UK", city: "London" },
        currentJobTitle: "Digital Marketing Specialist",
        currentCompany: "Marketing Pro Ltd",
        totalExperience: { years: 5, months: 2 },
        status: "reviewing",
        priority: "high"
      },
      {
        jobId: createdJobs[2]._id,
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+20-2-123-4567",
        nationality: "Egyptian",
        currentLocation: { country: "Egypt", city: "Cairo" },
        currentJobTitle: "Senior Accountant",
        currentCompany: "Finance Corp",
        totalExperience: { years: 4, months: 8 },
        status: "shortlisted",
        priority: "high"
      }
    ];

    await Application.insertMany(sampleApplications);

    // Create testimonials
    console.log('⭐ Creating testimonials...');
    await Testimonial.insertMany(sampleTestimonials);

    // Create events
    console.log('📅 Creating events...');
    await Event.insertMany(sampleEvents);

    // Create settings
    console.log('⚙️ Creating system settings...');
    await Setting.create({
      siteName: 'Uddaan Consultancy',
      siteDescription: 'Your gateway to Gulf career opportunities',
      contactEmail: 'info@uddaan.com',
      contactPhone: '+971-4-123-4567',
      address: 'Dubai, United Arab Emirates',
      socialMedia: {
        facebook: 'https://facebook.com/uddaan',
        linkedin: 'https://linkedin.com/company/uddaan',
        twitter: 'https://twitter.com/uddaan'
      },
      emailSettings: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: '',
        smtpPass: ''
      },
      seoSettings: {
        metaTitle: 'Uddaan Consultancy - Gulf Job Opportunities',
        metaDescription: 'Find your dream job in Gulf countries with Uddaan Consultancy',
        keywords: 'gulf jobs, dubai jobs, qatar jobs, saudi jobs, career'
      }
    });

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created: ${createdJobs.length} jobs, ${sampleApplications.length} applications, ${sampleTestimonials.length} testimonials, ${sampleEvents.length} events`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
