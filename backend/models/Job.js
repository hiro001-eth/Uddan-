const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['work', 'study', 'both']
  },
  salary: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  // Enhanced fields for study programs
  programType: {
    type: String,
    enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate', 'Work'],
    default: 'Master'
  },
  duration: {
    type: String,
    trim: true
  },
  tuitionFee: {
    type: String,
    trim: true
  },
  applicationDeadline: {
    type: Date
  },
  universityLogo: {
    type: String,
    trim: true
  },
  universityWebsite: {
    type: String,
    trim: true
  },
  scholarships: {
    type: Boolean,
    default: false
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  // SEO fields
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    trim: true
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema); 
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    enum: ['UAE', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Oman', 'Bahrain', 'Jordan', 'Lebanon', 'Other']
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote']
  },
  category: {
    type: String,
    required: true,
    enum: ['Engineering', 'Healthcare', 'Education', 'Finance', 'Marketing', 'Sales', 'Construction', 'Hospitality', 'IT', 'Other']
  },
  salaryMin: {
    type: Number,
    required: true
  },
  salaryMax: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'AED', 'QAR', 'SAR', 'KWD', 'OMR', 'BHD']
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  benefits: [{
    type: String
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    default: 'Mid Level'
  },
  education: {
    type: String,
    enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Certification', 'Not Required']
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  applicationDeadline: {
    type: Date
  },
  startDate: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  companyLogo: {
    type: String
  },
  workPermitSponsorship: {
    type: Boolean,
    default: false
  },
  accommodationProvided: {
    type: Boolean,
    default: false
  },
  transportationProvided: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ country: 1, jobType: 1 });
jobSchema.index({ category: 1, experienceLevel: 1 });
jobSchema.index({ featured: -1, createdAt: -1 });
jobSchema.index({ isActive: 1, applicationDeadline: 1 });

// Virtual for salary range
jobSchema.virtual('salaryRange').get(function() {
  return `${this.currency} ${this.salaryMin}-${this.salaryMax}/month`;
});

// Virtual for time since posted
jobSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Pre-save middleware
jobSchema.pre('save', function(next) {
  if (this.salaryMin > this.salaryMax) {
    const temp = this.salaryMin;
    this.salaryMin = this.salaryMax;
    this.salaryMax = temp;
  }
  next();
});

module.exports = mongoose.model('Job', jobSchema);
