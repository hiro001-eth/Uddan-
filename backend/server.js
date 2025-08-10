
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
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const sharp = require('sharp');
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

const allowedOrigins = (() => {
  const envOrigin = process.env.CORS_ORIGIN;
  const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  if (!envOrigin) return defaults;
  // support comma-separated origins
  return envOrigin.split(',').map((s) => s.trim()).filter(Boolean);
})();

app.use(cors({ origin: allowedOrigins, credentials: true }));

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

// Enhanced MongoDB Connection with Health Check
const connectToMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uddaan-consultancy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${connection.connection.db.databaseName}`);
    console.log(`🌐 Host: ${connection.connection.host}:${connection.connection.port}`);
    
    // Test database operations
    await testDatabaseOperations();
    await initializeSystem();
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

const testDatabaseOperations = async () => {
  try {
    // Test basic CRUD operations
    const testCollection = mongoose.connection.db.collection('health_check');
    
    // Create
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    
    // Read
    const doc = await testCollection.findOne({ test: 'connection' });
    
    // Update
    await testCollection.updateOne({ test: 'connection' }, { $set: { verified: true } });
    
    // Delete
    await testCollection.deleteOne({ test: 'connection' });
    
    console.log('✅ Database CRUD Operations: Working');
  } catch (error) {
    console.error('❌ Database CRUD Test Failed:', error.message);
    throw error;
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
});

// Initialize connection
connectToMongoDB();

// Enhanced Models with proper exports
const Job = require('./models/Job');
const Application = require('./models/Application');
const Admin = require('./models/Admin');
const User = require('./models/User');
const Role = require('./models/Role');
const Page = require('./models/Page');
const Media = require('./models/Media');
const AuditLog = require('./models/AuditLog');
const Theme = require('./models/Theme');
const Consultation = require('./models/Consultation');
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

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Audit logging middleware
const auditLogger = (action, model) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      // Log the action after response
      if (res.statusCode < 400) {
        AuditLog.create({
          userId: req.user?._id,
          action,
          model,
          modelId: req.params.id || 'bulk',
          changes: req.body,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          severity: action === 'delete' ? 'high' : 'low'
        }).catch(console.error);
      }
      originalSend.call(this, data);
    };
    next();
  };
};

// Enhanced authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'uddaan-super-secret-key-2024');
    const user = await User.findById(decoded.id).populate('roleId').select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Permission middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPermissions = req.user.roleId.permissions;
    if (userPermissions.includes('all') || userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

// Initialize system data
const initializeSystem = async () => {
  try {
    // Create default roles
    const superAdminRole = await Role.findOneAndUpdate(
      { name: 'Super Admin' },
      {
        name: 'Super Admin',
        description: 'Full system access',
        permissions: ['all'],
        isSystem: true
      },
      { upsert: true, new: true }
    );

    const adminRole = await Role.findOneAndUpdate(
      { name: 'Admin' },
      {
        name: 'Admin',
        description: 'Administrative access',
        permissions: [
          'dashboard.view', 'jobs.create', 'jobs.read', 'jobs.update', 'jobs.delete',
          'applications.read', 'applications.update', 'events.create', 'events.read',
          'events.update', 'testimonials.create', 'testimonials.read', 'testimonials.update',
          'media.upload', 'media.read', 'settings.read'
        ],
        isSystem: true
      },
      { upsert: true, new: true }
    );

    // Create default admin user
    const adminExists = await User.findOne({ email: 'admin@uddaan.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('uddaan123', 12);
      const admin = new User({
        email: 'admin@uddaan.com',
        password: hashedPassword,
        name: 'Super Admin',
        roleId: superAdminRole._id
      });
      await admin.save();
      console.log('✅ Default admin user created');
    }

    // Create default theme
    const defaultTheme = await Theme.findOneAndUpdate(
      { name: 'Default' },
      {
        name: 'Default',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('✅ System initialized');
  } catch (error) {
    console.error('❌ Error initializing system:', error);
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

// Submit application
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter } = req.body;

    if (!jobId || !name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: jobId, name, email, phone' 
      });
    }

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

// Submit consultation booking
app.post('/api/consultations', async (req, res) => {
  try {
    const { name, email, phone, consultationType, preferredDate, preferredTime, message } = req.body;

    const bookingId = 'CON-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const consultation = new Consultation({
      bookingId,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      consultationType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      message
    });

    await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully!',
      bookingId
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

// Get pages
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('authorId', 'name').lean();
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ADMIN ROUTES (Protected)

// Enhanced admin login
app.post('/api/admin/login', adminLimiter, async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, isActive: true }).populate('roleId');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return res.status(200).json({ 
          success: false, 
          message: 'MFA token required',
          requiresMFA: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaToken,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ success: false, message: 'Invalid MFA token' });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, roleId: user.roleId._id },
      process.env.JWT_SECRET || 'uddaan-super-secret-key-2024',
      { expiresIn: '24h' }
    );

    user.lastLogin = new Date();
    await user.save();

    // Log login
    await AuditLog.create({
      userId: user._id,
      action: 'login',
      model: 'User',
      modelId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      severity: 'low'
    });

    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.roleId.name,
        permissions: user.roleId.permissions,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Jobs Management Routes
app.get('/api/admin/jobs', authenticateAdmin, requirePermission('jobs.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, country, jobType, isActive } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (country) query.country = { $regex: country, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (typeof isActive !== 'undefined') query.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalJobs: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/jobs', authenticateAdmin, requirePermission('jobs.create'), auditLogger('create', 'Job'), async (req, res) => {
  try {
    const payload = { ...req.body };
    if (typeof payload.featured !== 'undefined') payload.featured = payload.featured === 'true' || payload.featured === true;
    if (typeof payload.isActive !== 'undefined') payload.isActive = payload.isActive === 'true' || payload.isActive === true;
    if (typeof payload.requirements === 'string') payload.requirements = payload.requirements.split(',').map(v => v.trim()).filter(Boolean);
    if (typeof payload.seoKeywords === 'string') payload.seoKeywords = payload.seoKeywords.split(',').map(v => v.trim()).filter(Boolean);

    const job = new Job(payload);
    await job.save();
    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateAdmin, requirePermission('jobs.update'), auditLogger('update', 'Job'), async (req, res) => {
  try {
    const payload = { ...req.body, updatedAt: new Date() };
    if (typeof payload.featured !== 'undefined') payload.featured = payload.featured === 'true' || payload.featured === true;
    if (typeof payload.isActive !== 'undefined') payload.isActive = payload.isActive === 'true' || payload.isActive === true;
    if (typeof payload.requirements === 'string') payload.requirements = payload.requirements.split(',').map(v => v.trim()).filter(Boolean);
    if (typeof payload.seoKeywords === 'string') payload.seoKeywords = payload.seoKeywords.split(',').map(v => v.trim()).filter(Boolean);

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateAdmin, requirePermission('jobs.delete'), auditLogger('delete', 'Job'), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete error', error: error.message });
  }
});

// Applications Management Routes
app.get('/api/admin/applications', authenticateAdmin, requirePermission('applications.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, jobId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const applications = await Application.find(query)
      .populate('jobId')
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
        total: Math.ceil(total / parseInt(limit)),
        totalApplications: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/applications/:id', authenticateAdmin, requirePermission('applications.update'), auditLogger('update', 'Application'), async (req, res) => {
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

// Setup MFA
app.post('/api/admin/mfa/setup', authenticateAdmin, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `Uddaan Consultancy (${req.user.email})`,
      issuer: 'Uddaan Consultancy'
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Verify and enable MFA
app.post('/api/admin/mfa/verify', authenticateAdmin, async (req, res) => {
  try {
    const { secret, token } = req.body;

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      mfaSecret: secret,
      mfaEnabled: true
    });

    res.json({ success: true, message: 'MFA enabled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Enhanced dashboard statistics
app.get('/api/admin/dashboard', authenticateAdmin, requirePermission('dashboard.view'), async (req, res) => {
  try {
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      totalTestimonials,
      totalEvents,
      upcomingEvents,
      totalConsultations,
      pendingConsultations,
      totalUsers,
      recentApplications,
      topJobs,
      monthlyStats,
      recentAuditLogs
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'new' }),
      Testimonial.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ startDate: { $gte: new Date() }, isActive: true }),
      Consultation.countDocuments(),
      Consultation.countDocuments({ status: 'pending' }),
      User.countDocuments({ isActive: true }),
      Application.find().populate('jobId').sort({ createdAt: -1 }).limit(10).lean(),
      Job.find({ isActive: true }).sort({ applications: -1, views: -1 }).limit(10).lean(),
      getMonthlyStats(),
      AuditLog.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(20).lean()
    ]);

    const stats = {
      jobs: { total: totalJobs, active: activeJobs },
      applications: { total: totalApplications, new: newApplications },
      testimonials: { total: totalTestimonials },
      events: { total: totalEvents, upcoming: upcomingEvents },
      consultations: { total: totalConsultations, pending: pendingConsultations },
      users: { total: totalUsers }
    };

    res.json({
      success: true,
      stats,
      recentApplications,
      topJobs,
      monthlyStats,
      recentAuditLogs
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

  const [jobStats, applicationStats, consultationStats] = await Promise.all([
    Job.aggregate(pipeline),
    Application.aggregate(pipeline),
    Consultation.aggregate(pipeline)
  ]);

  return { jobs: jobStats, applications: applicationStats, consultations: consultationStats };
};

// User Management Routes
app.get('/api/admin/users', authenticateAdmin, requirePermission('users.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, roleId } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (roleId) query.roleId = roleId;

    const skip = (page - 1) * parseInt(limit);
    const users = await User.find(query)
      .populate('roleId', 'name permissions')
      .select('-password -mfaSecret')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/users', authenticateAdmin, requirePermission('users.create'), auditLogger('create', 'User'), async (req, res) => {
  try {
    const { name, email, password, roleId, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      roleId,
      phone
    });

    await user.save();
    await user.populate('roleId', 'name permissions');

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.roleId,
        phone: user.phone,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// Role Management Routes
app.get('/api/admin/roles', authenticateAdmin, requirePermission('roles.read'), async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 }).lean();
    res.json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/roles', authenticateAdmin, requirePermission('roles.create'), auditLogger('create', 'Role'), async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();

    res.status(201).json({ success: true, message: 'Role created successfully', role });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// Page Management Routes
app.get('/api/admin/pages', authenticateAdmin, requirePermission('pages.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * parseInt(limit);
    const pages = await Page.find(query)
      .populate('authorId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Page.countDocuments(query);

    res.json({
      success: true,
      pages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/pages', authenticateAdmin, requirePermission('pages.create'), auditLogger('create', 'Page'), async (req, res) => {
  try {
    const pageData = {
      ...req.body,
      authorId: req.user._id,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    const page = new Page(pageData);
    await page.save();

    res.status(201).json({ success: true, message: 'Page created successfully', page });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// Media Management Routes
app.get('/api/admin/media', authenticateAdmin, requirePermission('media.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, mimeType, tags } = req.query;

    let query = {};
    if (mimeType) query.mimeType = { $regex: mimeType, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (page - 1) * parseInt(limit);
    const media = await Media.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Media.countDocuments(query);

    res.json({
      success: true,
      media,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/media', authenticateAdmin, requirePermission('media.upload'), upload.array('files', 10), auditLogger('create', 'Media'), async (req, res) => {
  try {
    const { altText, tags, isPublic = true } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      let width, height;
      
      // Get image dimensions if it's an image
      if (file.mimetype.startsWith('image/')) {
        try {
          const metadata = await sharp(file.path).metadata();
          width = metadata.width;
          height = metadata.height;

          // Generate thumbnails
          const thumbnails = {};
          const sizes = { small: 150, medium: 300, large: 600 };
          
          for (const [size, dimension] of Object.entries(sizes)) {
            const thumbnailPath = `uploads/thumbnails/${size}-${file.filename}`;
            await sharp(file.path)
              .resize(dimension, dimension, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toFile(thumbnailPath);
            thumbnails[size] = thumbnailPath;
          }

          const media = new Media({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            width,
            height,
            path: file.path,
            uploadedBy: req.user._id,
            altText: altText || file.originalname,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isPublic: isPublic === 'true',
            thumbnails
          });

          await media.save();
          uploadedFiles.push(media);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      } else {
        // Non-image file
        const media = new Media({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          uploadedBy: req.user._id,
          altText: altText || file.originalname,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          isPublic: isPublic === 'true'
        });

        await media.save();
        uploadedFiles.push(media);
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Files uploaded successfully', 
      files: uploadedFiles 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload error', error: error.message });
  }
});

// Consultation Management Routes
app.get('/api/admin/consultations', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * parseInt(limit);
    const consultations = await Consultation.find(query)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Consultation.countDocuments(query);

    res.json({
      success: true,
      consultations,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalConsultations: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/consultations/:id', authenticateAdmin, auditLogger('update', 'Consultation'), async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name');

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    res.json({ success: true, message: 'Consultation updated successfully', consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

// Audit Log Routes
app.get('/api/admin/audit', authenticateAdmin, requirePermission('audit.read'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, model, userId, startDate, endDate } = req.query;

    let query = {};
    if (action) query.action = action;
    if (model) query.model = model;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * parseInt(limit);
    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalLogs: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Theme Management Routes
app.get('/api/admin/themes', authenticateAdmin, requirePermission('theme.read'), async (req, res) => {
  try {
    const themes = await Theme.find().sort({ name: 1 }).lean();
    res.json({ success: true, themes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/themes', authenticateAdmin, requirePermission('theme.update'), auditLogger('create', 'Theme'), async (req, res) => {
  try {
    // Deactivate all themes if this one is being set as active
    if (req.body.isActive) {
      await Theme.updateMany({}, { isActive: false });
    }

    const theme = new Theme(req.body);
    await theme.save();

    res.status(201).json({ success: true, message: 'Theme created successfully', theme });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// ====== ADMIN CRUD ROUTES ======

// Jobs Management
app.get('/api/admin/jobs', authenticateAdmin, requirePermission('jobs.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, country, jobType, category, status } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (country) query.country = country;
    if (jobType) query.jobType = jobType;
    if (category) query.category = category;
    if (status) query.isActive = status === 'active';

    const skip = (page - 1) * parseInt(limit);
    const jobs = await Job.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
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

app.post('/api/admin/jobs', authenticateAdmin, requirePermission('jobs.create'), auditLogger('create', 'Job'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({ 
      success: true, 
      message: 'Job created successfully', 
      job 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateAdmin, requirePermission('jobs.update'), auditLogger('update', 'Job'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateAdmin, requirePermission('jobs.delete'), auditLogger('delete', 'Job'), async (req, res) => {
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

// Applications Management
app.get('/api/admin/applications', authenticateAdmin, requirePermission('applications.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, jobId } = req.query;

    let query = {};
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * parseInt(limit);
    const applications = await Application.find(query)
      .populate('jobId', 'title company country')
      .populate('assignedTo', 'name')
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

app.put('/api/admin/applications/:id', authenticateAdmin, requirePermission('applications.update'), auditLogger('update', 'Application'), async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('jobId', 'title company').populate('assignedTo', 'name');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application updated successfully', application });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

// Testimonials Management
app.get('/api/admin/testimonials', authenticateAdmin, requirePermission('testimonials.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, featured } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (featured !== undefined) query.featured = featured === 'true';

    const skip = (page - 1) * parseInt(limit);
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Testimonial.countDocuments(query);

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

app.post('/api/admin/testimonials', authenticateAdmin, requirePermission('testimonials.create'), auditLogger('create', 'Testimonial'), async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();

    res.status(201).json({ success: true, message: 'Testimonial created successfully', testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/testimonials/:id', authenticateAdmin, requirePermission('testimonials.update'), auditLogger('update', 'Testimonial'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, message: 'Testimonial updated successfully', testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/testimonials/:id', authenticateAdmin, requirePermission('testimonials.delete'), auditLogger('delete', 'Testimonial'), async (req, res) => {
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

// Events Management
app.get('/api/admin/events', authenticateAdmin, requirePermission('events.read'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, eventType } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (eventType) query.eventType = eventType;

    const skip = (page - 1) * parseInt(limit);
    const events = await Event.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Event.countDocuments(query);

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

app.post('/api/admin/events', authenticateAdmin, requirePermission('events.create'), auditLogger('create', 'Event'), async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();

    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

app.put('/api/admin/events/:id', authenticateAdmin, requirePermission('events.update'), auditLogger('update', 'Event'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, message: 'Event updated successfully', event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

app.delete('/api/admin/events/:id', authenticateAdmin, requirePermission('events.delete'), auditLogger('delete', 'Event'), async (req, res) => {
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
app.get('/api/admin/settings', authenticateAdmin, requirePermission('settings.read'), async (req, res) => {
  try {
    const settings = await Setting.findOne().lean();
    res.json({ success: true, settings: settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/settings', authenticateAdmin, requirePermission('settings.update'), auditLogger('update', 'Setting'), async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error: error.message });
  }
});

// Database health check endpoint
app.get('/api/admin/database/health', authenticateAdmin, async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const stats = {
      state: states[dbState],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections),
      uptime: process.uptime()
    };

    // Test operations
    const testResults = {
      canRead: false,
      canWrite: false,
      canUpdate: false,
      canDelete: false
    };

    try {
      // Test read
      await Job.findOne().limit(1);
      testResults.canRead = true;

      // Test write
      const testDoc = new mongoose.connection.db.collection('health_test');
      await testDoc.insertOne({ test: true, timestamp: new Date() });
      testResults.canWrite = true;

      // Test update
      await testDoc.updateOne({ test: true }, { $set: { updated: true } });
      testResults.canUpdate = true;

      // Test delete
      await testDoc.deleteOne({ test: true });
      testResults.canDelete = true;
    } catch (error) {
      console.error('Database operation test failed:', error);
    }

    res.json({
      success: true,
      database: {
        ...stats,
        operations: testResults,
        healthy: dbState === 1 && testResults.canRead && testResults.canWrite
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database health check failed', 
      error: error.message 
    });
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
if (!fs.existsSync('uploads/thumbnails')) {
  fs.mkdirSync('uploads/thumbnails', { recursive: true });
}

// Comprehensive health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const health = {
      success: true,
      message: 'Uddaan Consultancy API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        connected: false,
        state: 'unknown',
        collections: [],
        operations: {
          read: false,
          write: false,
          update: false,
          delete: false
        }
      }
    };

    // Check database connection
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    health.database.state = states[dbState];
    health.database.connected = dbState === 1;

    if (health.database.connected) {
      // Get collection names
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        health.database.collections = collections.map(col => col.name);
      } catch (error) {
        health.database.collections = ['Error fetching collections'];
      }

      // Test database operations
      try {
        const testCollection = mongoose.connection.db.collection('health_test');
        
        // Test write
        await testCollection.insertOne({ test: true, timestamp: new Date() });
        health.database.operations.write = true;

        // Test read
        const doc = await testCollection.findOne({ test: true });
        health.database.operations.read = !!doc;

        // Test update
        await testCollection.updateOne({ test: true }, { $set: { updated: true } });
        health.database.operations.update = true;

        // Test delete
        await testCollection.deleteOne({ test: true });
        health.database.operations.delete = true;

      } catch (error) {
        console.error('Database operations test failed:', error);
      }

      // Get collection counts
      try {
        const stats = {};
        stats.users = await User.countDocuments();
        stats.jobs = await Job.countDocuments();
        stats.applications = await Application.countDocuments();
        stats.testimonials = await Testimonial.countDocuments();
        stats.events = await Event.countDocuments();
        health.database.stats = stats;
      } catch (error) {
        health.database.stats = { error: 'Could not fetch stats' };
      }
    }

    // Determine overall health
    health.healthy = health.database.connected && 
                    health.database.operations.read && 
                    health.database.operations.write;

    res.status(health.healthy ? 200 : 503).json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Uddaan Consultancy server running on port ${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/api/admin`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
});
