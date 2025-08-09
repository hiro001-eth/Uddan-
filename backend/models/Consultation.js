
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true
  },
  clientPhone: {
    type: String,
    required: true,
    trim: true
  },
  consultationType: {
    type: String,
    enum: ['job_guidance', 'visa_assistance', 'study_abroad', 'general'],
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    default: 60 // minutes
  },
  meetingLink: String,
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp']
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed']
    }
  }],
  followUp: {
    required: { type: Boolean, default: false },
    scheduledAt: Date,
    completed: { type: Boolean, default: false },
    notes: String
  }
}, {
  timestamps: true
});

consultationSchema.index({ bookingId: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ preferredDate: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);
