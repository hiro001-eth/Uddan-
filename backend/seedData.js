
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Role = require('./models/Role');
const Job = require('./models/Job');
const Page = require('./models/Page');
const Setting = require('./models/Setting');
const Theme = require('./models/Theme');
const Event = require('./models/Event');
const Testimonial = require('./models/Testimonial');

const seedDatabase = async () => {
  try {
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
        jobType: 'Full-time',
        programType: 'Professional',
        salaryRange: 'AED 8,000 - 12,000',
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
        jobType: 'Full-time',
        programType: 'Healthcare',
        salaryRange: 'QAR 6,000 - 9,000',
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
        jobType: 'Contract',
        programType: 'Construction',
        salaryRange: 'SAR 2,500 - 4,000',
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
        venue: 'Kathmandu Convention Center',
        startDate: new Date('2024-03-15T09:00:00Z'),
        endDate: new Date('2024-03-15T17:00:00Z'),
        eventType: 'Job Fair',
        capacity: 500,
        ticketPrice: 0,
        isActive: true,
        featured: true,
        createdBy: users[0]._id
      },
      {
        title: 'Visa Process Workshop',
        description: 'Learn about visa requirements and application processes for Gulf countries.',
        venue: 'Uddaan Office',
        startDate: new Date('2024-03-20T14:00:00Z'),
        endDate: new Date('2024-03-20T16:00:00Z'),
        eventType: 'Workshop',
        capacity: 50,
        ticketPrice: 500,
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
        content: 'Uddaan Consultancy helped me land my dream job in Dubai. Their support throughout the visa process was exceptional.',
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
        content: 'Professional service and genuine guidance. I highly recommend Uddaan for anyone looking to work abroad.',
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
        content: 'Thanks to Uddaan, I got a great job in Saudi Arabia with excellent salary and benefits.',
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
    });
    console.log('Created default theme');

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Roles: ${roles.length}`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Testimonials: ${testimonials.length}`);
    console.log(`- Pages: ${pages.length}`);
    console.log(`- Settings: ${settings.length}`);
    console.log(`- Theme: 1`);
    
    console.log('\n🔐 Admin Credentials:');
    console.log('Email: admin@uddaan.com');
    console.log('Password: uddaan123');
    
    console.log('\n🌐 Access URLs:');
    console.log('Frontend: http://localhost:3000');
    console.log('Admin Panel: http://localhost:3000/secure-admin-access-2024');
    console.log('API Health: http://localhost:5000/api/health');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
