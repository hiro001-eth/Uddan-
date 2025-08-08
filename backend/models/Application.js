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
  resume: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'contacted', 'accepted', 'rejected'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema); 