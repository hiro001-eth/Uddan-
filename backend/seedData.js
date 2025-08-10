
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
<<<<<<< HEAD
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uddaan-consultancy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
=======
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uddaan-consultancy');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Role.deleteMany({}),
      Job.deleteMany({}),
      Page.deleteMany({}),
      Setting.deleteMany({}),
      Theme.deleteMany({}),
      Event.deleteMany({}),
      Testimonial.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create Roles
    const roles = await Role.insertMany([
      {
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        permissions: ['all'],
        isSystem: true
      },
      {
        name: 'Admin',
        description: 'Administrative access to most features',
        permissions: [
          'dashboard.view', 'jobs.create', 'jobs.read', 'jobs.update', 'jobs.delete',
          'applications.read', 'applications.update', 'events.create', 'events.read',
          'events.update', 'testimonials.create', 'testimonials.read', 'testimonials.update',
          'media.upload', 'media.read', 'settings.read', 'users.read'
        ],
        isSystem: true
      },
      {
        name: 'Editor',
        description: 'Content management and editing capabilities',
        permissions: [
          'dashboard.view', 'jobs.read', 'jobs.update', 'applications.read',
          'events.read', 'events.update', 'testimonials.read', 'testimonials.update',
          'pages.create', 'pages.read', 'pages.update', 'media.upload', 'media.read'
        ],
        isSystem: true
      },
      {
        name: 'Viewer',
        description: 'Read-only access to most features',
        permissions: [
          'dashboard.view', 'jobs.read', 'applications.read', 'events.read',
          'testimonials.read', 'pages.read', 'media.read'
        ],
        isSystem: true
      }
    ]);
    console.log('Created roles');

    // Create Users
    const hashedPassword = await bcrypt.hash('uddaan123', 12);
    const users = await User.insertMany([
      {
        name: 'Super Admin',
        email: 'admin@uddaan.com',
        password: hashedPassword,
        roleId: roles[0]._id,
        isActive: true,
        phone: '+977-1-4444444'
      },
      {
        name: 'Content Manager',
        email: 'content@uddaan.com',
        password: hashedPassword,
        roleId: roles[2]._id,
        isActive: true,
        phone: '+977-1-4444445'
      }
    ]);
    console.log('Created users');

    // Create Sample Jobs
    const jobs = await Job.insertMany([
      {
        title: 'Software Engineer - Dubai',
        company: 'Tech Solutions UAE',
        country: 'UAE',
        city: 'Dubai',
        jobType: 'work',
        programType: 'Work',
        salary: 'AED 8,000 - 12,000',
        description: 'Join our dynamic team as a Software Engineer in Dubai. Work on cutting-edge projects with the latest technologies.',
        requirements: ['Bachelor\'s in Computer Science', '3+ years experience', 'JavaScript, React, Node.js', 'English proficiency'],
        benefits: ['Health Insurance', 'Annual Leave', 'Professional Development', 'Visa Sponsorship'],
        contactEmail: 'jobs@techsolutions.ae',
        isActive: true,
        featured: true,
        createdBy: users[0]._id,
        seoKeywords: ['software engineer', 'dubai jobs', 'tech jobs', 'programming']
      },
      {
        title: 'Nurse - Qatar',
        company: 'Qatar Medical Center',
        country: 'Qatar',
        city: 'Doha',
        jobType: 'work',
        programType: 'Work',
        salary: 'QAR 6,000 - 9,000',
        description: 'Experienced nurses needed for our state-of-the-art medical facility in Doha.',
        requirements: ['Nursing Degree', 'License', '2+ years experience', 'Arabic/English'],
        benefits: ['Accommodation', 'Transportation', 'Health Insurance', 'Annual Bonus'],
        contactEmail: 'hr@qmc.qa',
        isActive: true,
        featured: false,
        createdBy: users[0]._id,
        seoKeywords: ['nurse jobs', 'qatar healthcare', 'medical jobs', 'doha']
      },
      {
        title: 'Construction Worker - Saudi Arabia',
        company: 'Gulf Construction Co.',
        country: 'Saudi Arabia',
        city: 'Riyadh',
        jobType: 'work',
        programType: 'Work',
        salary: 'SAR 2,500 - 4,000',
        description: 'Skilled construction workers needed for major infrastructure projects in Riyadh.',
        requirements: ['Construction experience', 'Physical fitness', 'Safety certification'],
        benefits: ['Accommodation', 'Food allowance', 'Overtime pay', 'Return ticket'],
        contactEmail: 'jobs@gulfconstruction.sa',
        isActive: true,
        featured: false,
        createdBy: users[0]._id,
        seoKeywords: ['construction jobs', 'saudi arabia', 'riyadh jobs', 'labor']
      }
    ]);
    console.log('Created sample jobs');

    // Create Sample Events
    const events = await Event.insertMany([
      {
        title: 'Job Fair - Gulf Opportunities 2024',
        description: 'Connect with top employers from UAE, Qatar, Saudi Arabia, and other Gulf countries.',
        shortDescription: 'Meet top Gulf employers and explore opportunities.',
        location: 'Kathmandu Convention Center',
        startDate: new Date('2024-03-15T09:00:00Z'),
        endDate: new Date('2024-03-15T17:00:00Z'),
        eventType: 'conference',
        isActive: true,
        featured: true,
        createdBy: users[0]._id
      },
      {
        title: 'Visa Process Workshop',
        description: 'Learn about visa requirements and application processes for Gulf countries.',
        shortDescription: 'Step-by-step visa guidance for Gulf countries.',
        location: 'Uddaan Office',
        startDate: new Date('2024-03-20T14:00:00Z'),
        endDate: new Date('2024-03-20T16:00:00Z'),
        eventType: 'workshop',
        isActive: true,
        featured: false,
        createdBy: users[0]._id
      }
    ]);
    console.log('Created sample events');

    // Create Sample Testimonials
    const testimonials = await Testimonial.insertMany([
      {
        name: 'Raj Kumar Sharma',
        position: 'Software Engineer',
        company: 'Dubai Tech Solutions',
        country: 'Nepal',
        testimonial: 'Uddaan Consultancy helped me land my dream job in Dubai. Their support throughout the visa process was exceptional.',
        rating: 5,
        image: 'testimonial-1.jpg',
        isActive: true,
        featured: true,
        order: 1
      },
      {
        name: 'Sita Devi Patel',
        position: 'Registered Nurse',
        company: 'Qatar Medical Center',
        country: 'Nepal',
        testimonial: 'Professional service and genuine guidance. I highly recommend Uddaan for anyone looking to work abroad.',
        rating: 5,
        image: 'testimonial-2.jpg',
        isActive: true,
        featured: true,
        order: 2
      },
      {
        name: 'Krishna Bahadur Thapa',
        position: 'Construction Supervisor',
        company: 'Saudi Construction Ltd',
        country: 'Nepal',
        testimonial: 'Thanks to Uddaan, I got a great job in Saudi Arabia with excellent salary and benefits.',
        rating: 5,
        image: 'testimonial-3.jpg',
        isActive: true,
        featured: false,
        order: 3
      }
    ]);
    console.log('Created sample testimonials');

    // Create Sample Pages
    const pages = await Page.insertMany([
      {
        slug: 'about',
        title: 'About Uddaan Consultancy',
        body: '<h1>About Uddaan Consultancy</h1><p>We are a leading consultancy firm helping Nepali professionals find opportunities in Gulf countries.</p>',
        metaTitle: 'About Us - Uddaan Consultancy',
        metaDescription: 'Learn about Uddaan Consultancy, your trusted partner for Gulf employment opportunities.',
        status: 'published',
        authorId: users[0]._id,
        publishedAt: new Date(),
        seoKeywords: ['about uddaan', 'consultancy nepal', 'gulf jobs'],
        language: 'en'
      },
      {
        slug: 'services',
        title: 'Our Services',
        body: '<h1>Our Services</h1><p>We offer comprehensive services including job placement, visa assistance, and career guidance.</p>',
        metaTitle: 'Services - Uddaan Consultancy',
        metaDescription: 'Explore our comprehensive services for Gulf employment and career development.',
        status: 'published',
        authorId: users[0]._id,
        publishedAt: new Date(),
        seoKeywords: ['services', 'job placement', 'visa assistance'],
        language: 'en'
      }
    ]);
    console.log('Created sample pages');

    // Create Settings
    const settings = await Setting.insertMany([
      {
        key: 'site_title',
        value: 'Uddaan Consultancy - Your Gateway to Gulf Opportunities',
        category: 'general',
        description: 'Main site title',
        isPublic: true
      },
      {
        key: 'site_description',
        value: 'Leading consultancy firm connecting Nepali professionals with opportunities in Gulf countries.',
        category: 'general',
        description: 'Site description for SEO',
        isPublic: true
      },
      {
        key: 'contact_email',
        value: 'info@uddaanconsultancy.com',
        category: 'contact',
        description: 'Main contact email',
        isPublic: true
      },
      {
        key: 'contact_phone',
        value: '+977-1-4444444',
        category: 'contact',
        description: 'Main contact phone',
        isPublic: true
      },
      {
        key: 'office_address',
        value: 'New Baneshwor, Kathmandu, Nepal',
        category: 'contact',
        description: 'Office address',
        isPublic: true
      },
      {
        key: 'facebook_url',
        value: 'https://facebook.com/uddaanconsultancy',
        category: 'social',
        description: 'Facebook page URL',
        isPublic: true
      },
      {
        key: 'instagram_url',
        value: 'https://instagram.com/uddaanconsultancy',
        category: 'social',
        description: 'Instagram page URL',
        isPublic: true
      },
      {
        key: 'linkedin_url',
        value: 'https://linkedin.com/company/uddaanconsultancy',
        category: 'social',
        description: 'LinkedIn page URL',
        isPublic: true
      },
      {
        key: 'google_analytics_id',
        value: 'GA-XXXXXXXXX',
        category: 'analytics',
        description: 'Google Analytics tracking ID',
        isPublic: false
      },
      {
        key: 'max_applications_per_day',
        value: '10',
        category: 'limits',
        description: 'Maximum applications per day per IP',
        isPublic: false
      }
    ]);
    console.log('Created settings');

    // Create Default Theme
    const theme = await Theme.create({
      name: 'Default',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280'
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Inter',
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '3rem'
      },
      isActive: true,
      darkMode: {
        enabled: true,
        colors: {
          primary: '#60A5FA',
          background: '#111827',
          surface: '#1F2937',
          text: '#F9FAFB'
        }
      }
>>>>>>> 9e11769 (feat(contacts): add admin Contacts CRUD (backend Prisma model, REST endpoints, OpenAPI) and frontend Contacts table with View/Edit/Delete modals, sticky header, accessible actions; also add public job/app endpoints and application phone field)
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
