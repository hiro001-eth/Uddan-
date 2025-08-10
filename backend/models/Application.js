
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'contacted', 'interview', 'accepted', 'rejected'],
    default: 'new'
  },
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  source: {
    type: String,
    default: 'website'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  followUpDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    required: true
  },
  currentLocation: {
    country: { type: String, required: true },
    city: { type: String, required: true }
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other']
  },
  
  // Professional Information
  currentJobTitle: {
    type: String,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  totalExperience: {
    years: { type: Number, default: 0 },
    months: { type: Number, default: 0 }
  },
  currentSalary: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  expectedSalary: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  noticePeriod: {
    type: String,
    enum: ['Immediate', '1 week', '2 weeks', '1 month', '2 months', '3 months', 'More than 3 months']
  },
  
  // Education
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: String,
    graduationYear: Number,
    grade: String
  }],
  
  // Skills and Certifications
  skills: [{
    type: String,
    trim: true
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String
  }],
  languages: [{
    language: { type: String, required: true },
    proficiency: { 
      type: String, 
      enum: ['Basic', 'Intermediate', 'Advanced', 'Native'],
      required: true 
    }
  }],
  
  // Documents
  resume: {
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  coverLetter: {
    type: String,
    maxlength: 2000
  },
  portfolio: {
    url: String,
    description: String
  },
  additionalDocuments: [{
    filename: String,
    originalName: String,
    path: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Application Status
  status: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected', 'withdrawn', 'hired'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'job_board', 'recruitment_agency', 'direct'],
    default: 'website'
  },
  
  // Interview Information
  interviews: [{
    type: { 
      type: String, 
      enum: ['phone', 'video', 'in_person', 'technical', 'hr', 'final'],
      required: true 
    },
    scheduledDate: Date,
    duration: Number, // in minutes
    interviewerName: String,
    interviewerEmail: String,
    meetingLink: String,
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    feedback: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    }
  }],
  
  // Communication History
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'message', 'interview', 'offer'],
      required: true
    },
    subject: String,
    content: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: { type: Date, default: Date.now },
    emailSent: { type: Boolean, default: false }
  }],
  
  // Visa and Legal
  visaStatus: {
    type: String,
    enum: ['none', 'tourist', 'student', 'work', 'resident', 'citizen']
  },
  workPermitRequired: {
    type: Boolean,
    default: true
  },
  willingToRelocate: {
    type: Boolean,
    default: true
  },
  
  // Recruiter Notes
  recruiterNotes: [{
    note: { type: String, required: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: false }
  }],
  
  // Assignment and Tracking
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  lastContactDate: Date,
  nextFollowUpDate: Date,
  
  // System Information
  ipAddress: String,
  userAgent: String,
  referrerUrl: String,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  
  // Preferences
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate application ID
applicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const count = await this.constructor.countDocuments();
    this.applicationId = `APP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes for better performance
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ assignedTo: 1, status: 1 });
applicationSchema.index({ applicationId: 1 });

// Virtual for full name
applicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for total experience in readable format
applicationSchema.virtual('experienceFormatted').get(function() {
  const years = this.totalExperience.years;
  const months = this.totalExperience.months;
  
  if (years === 0 && months === 0) return 'Fresher';
  if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
});

module.exports = mongoose.model('Application', applicationSchema);
