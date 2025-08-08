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