
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://your-domain.com'] : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Strict admin rate limiting
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many admin requests, please try again later.',
});

// MongoDB Connection with enhanced options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uddaan-consultancy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  initializeAdminUser();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Models
const Job = require('./models/Job');
const Application = require('./models/Application');
const Admin = require('./models/Admin');
const Testimonial = require('./models/Testimonial');
const Event = require('./models/Event');
const Setting = require('./models/Setting');

// Enhanced file upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + sanitizedName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only images, PDF, and DOC files are allowed.'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Enhanced authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'uddaan-super-secret-key-2024');
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid token or admin deactivated.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Initialize default admin user
const initializeAdminUser = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@uddaan.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('uddaan123', 12);
      const admin = new Admin({
        email: 'admin@uddaan.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super_admin',
        permissions: ['all']
      });
      await admin.save();
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// PUBLIC ROUTES

// Get all jobs with enhanced filtering and pagination
app.get('/api/jobs', async (req, res) => {
  try {
    const { 
      country, 
      jobType, 
      search, 
      featured, 
      programType, 
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let query = { isActive: true };
    
    if (country) query.country = { $regex: country, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (featured === 'true') query.featured = true;
    if (programType) query.programType = programType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const jobs = await Job.find(query)
      .sort({ featured: -1, ...sortObj })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Job.countDocuments(query);
    
    res.json({
      success: true,
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + jobs.length < total,
        hasPrev: page > 1,
        totalJobs: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single job with view tracking
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // Increment view count
    job.views += 1;
    await job.save();
    
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Submit application with enhanced validation
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter } = req.body;
    
    // Validate required fields
    if (!jobId || !name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: jobId, name, email, phone' 
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    const application = new Application({
      jobId,
      name,
      email,
      phone,
      coverLetter,
      resume: req.file ? req.file.filename : null,
      status: 'new',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    await application.save();
    
    // Update job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });
    
    res.status(201).json({ 
      success: true,
      message: 'Application submitted successfully!',
      applicationId: application._id 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, featured: -1, createdAt: -1 })
      .lean();
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get events
app.get('/api/events', async (req, res) => {
  try {
    const { type, featured, upcoming } = req.query;
    let query = { isActive: true };
    
    if (type) query.eventType = type;
    if (featured === 'true') query.featured = true;
    if (upcoming === 'true') query.startDate = { $gte: new Date() };
    
    const events = await Event.find(query)
      .sort({ startDate: 1, featured: -1 })
      .lean();
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get public settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true }).lean();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Enhanced AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const text = (message || '').toLowerCase();
    
    let reply = 'Hello! I\'m here to help you with jobs, consultation booking, and visa guidance. What would you like to know?';
    
    if (text.includes('job') || text.includes('vacancy') || text.includes('work')) {
      reply = 'We have exciting job opportunities in Gulf countries including UAE, Qatar, Saudi Arabia, Kuwait, Oman, and Bahrain. You can browse our Jobs page and filter by country, job type, or search for specific positions. Would you like me to help you find something specific?';
    } else if (text.includes('consult') || text.includes('book') || text.includes('appointment')) {
      reply = 'You can schedule a personalized 1:1 consultation with our experts from the Consultation page. Choose a convenient date and time, and we\'ll provide guidance tailored to your career goals!';
    } else if (text.includes('visa') || text.includes('document')) {
      reply = 'We provide comprehensive visa assistance including documentation, process guidance, and support throughout your application. Our team helps with visa requirements for all Gulf countries after your job application is accepted.';
    } else if (text.includes('contact') || text.includes('support') || text.includes('help')) {
      reply = 'You can reach us through multiple channels: Visit our Contact page, call us at +977-1-4444444, email us at info@uddaanconsultancy.com, or use this chat for immediate assistance!';
    } else if (text.includes('study') || text.includes('education') || text.includes('university')) {
      reply = 'We also assist with study abroad opportunities! Browse our educational programs and university partnerships. We can help with admissions, scholarships, and student visa processes.';
    }
    
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      reply: 'Sorry, I encountered an issue. Please try again or contact our support team.' 
    });
  }
});

// ADMIN ROUTES (Protected)

// Enhanced admin login
app.post('/api/admin/login', adminLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'uddaan-super-secret-key-2024',
      { expiresIn: '24h' }
    );
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Enhanced dashboard statistics
app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      totalTestimonials,
      totalEvents,
      upcomingEvents,
      recentApplications,
      topJobs,
      monthlyStats
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'new' }),
      Testimonial.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ startDate: { $gte: new Date() }, isActive: true }),
      Application.find().populate('jobId').sort({ createdAt: -1 }).limit(10).lean(),
      Job.find({ isActive: true }).sort({ applications: -1, views: -1 }).limit(10).lean(),
      getMonthlyStats()
    ]);

    const stats = {
      jobs: { total: totalJobs, active: activeJobs },
      applications: { total: totalApplications, new: newApplications },
      testimonials: { total: totalTestimonials },
      events: { total: totalEvents, upcoming: upcomingEvents }
    };

    res.json({
      success: true,
      stats,
      recentApplications,
      topJobs,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Helper function for monthly stats
const getMonthlyStats = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const pipeline = [
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ];
  
  const [jobStats, applicationStats] = await Promise.all([
    Job.aggregate(pipeline),
    Application.aggregate(pipeline)
  ]);
  
  return { jobs: jobStats, applications: applicationStats };
};

// Job Management Routes
app.get('/api/admin/jobs', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.isActive = status === 'active';
    
    const skip = (page - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const jobs = await Job.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Job.countDocuments(query);
    
    res.json({
      success: true,
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalJobs: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/jobs', authenticateAdmin, upload.single('universityLogo'), async (req, res) => {
  try {
    const jobData = { ...req.body };
    if (req.file) jobData.universityLogo = req.file.filename;
    
    // Parse arrays if they come as strings
    if (typeof jobData.requirements === 'string') {
      jobData.requirements = jobData.requirements.split(',').map(req => req.trim());
    }
    if (typeof jobData.seoKeywords === 	) {
      jobData.seoKeywords = jobData.seoKeywords.split(',').map(keyword => keyword.trim());
    }
    
    const job = new Job(jobData);
    await job.save();
    
    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateAdmin, upload.single('universityLogo'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.universityLogo = req.file.filename;
    
    // Parse arrays if they come as strings
    if (typeof updateData.requirements === 'string') {
      updateData.requirements = updateData.requirements.split(',').map(req => req.trim());
    }
    if (typeof updateData.seoKeywords === 'string') {
      updateData.seoKeywords = updateData.seoKeywords.split(',').map(keyword => keyword.trim());
    }
    
    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Application Management Routes
app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
  try {
    const { status, jobId, page = 1, limit = 20, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * parseInt(limit);
    const applications = await Application.find(query)
      .populate('jobId', 'title company country')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Application.countDocuments(query);
    
    res.json({
      success: true,
      applications,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalApplications: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/applications/:id', authenticateAdmin, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, message: 'Application updated successfully', application });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

// Testimonial Management Routes
app.get('/api/admin/testimonials', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Testimonial.countDocuments();
    
    res.json({
      success: true,
      testimonials,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/testimonials', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const testimonialData = { ...req.body };
    if (req.file) testimonialData.image = req.file.filename;
    
    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();
    
    res.status(201).json({ success: true, message: 'Testimonial created successfully', testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/testimonials/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.filename;
    
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    
    res.json({ success: true, message: 'Testimonial updated successfully', testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/testimonials/:id', authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Event Management Routes
app.get('/api/admin/events', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    const events = await Event.find()
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Event.countDocuments();
    
    res.json({
      success: true,
      events,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/events', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.file) eventData.image = req.file.filename;
    
    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/events/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.filename;
    
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.json({ success: true, message: 'Event updated successfully', event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/events/:id', authenticateAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Settings Management
app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await Setting.find().lean();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const { key, value, category, description, isPublic } = req.body;
    
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, category, description, isPublic },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: 'Setting updated successfully', setting });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large' });
    }
  }
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Uddaan Consultancy API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Uddaan Consultancy server running on port ${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/api/admin`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
});
