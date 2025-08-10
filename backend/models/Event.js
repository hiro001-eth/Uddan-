const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    enum: ['workshop', 'seminar', 'webinar', 'conference', 'news', 'announcement'],
    default: 'workshop'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  online: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  maxParticipants: {
    type: Number,
    default: 0
  },
  currentParticipants: {
    type: Number,
    default: 0
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
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['career_fair', 'workshop', 'seminar', 'networking', 'webinar', 'interview_day', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  venue: {
    name: String,
    address: String,
    city: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  capacity: {
    type: Number,
    default: 0
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  organizer: {
    type: String,
    default: 'Uddaan Consultancy'
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  },
  image: {
    type: String
  },
  gallery: [{
    type: String
  }],
  agenda: [{
    time: String,
    title: String,
    speaker: String,
    description: String
  }],
  speakers: [{
    name: { type: String, required: true },
    title: String,
    company: String,
    bio: String,
    image: String,
    linkedin: String
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    level: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze', 'partner']
    }
  }],
  registrationDeadline: {
    type: Date
  },
  requirements: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String
  },
  recordingAvailable: {
    type: Boolean,
    default: false
  },
  certificateProvided: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ eventType: 1, isActive: 1 });
eventSchema.index({ featured: -1, startDate: 1 });

// Virtual for event status
eventSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now > this.endDate) return 'completed';
  return 'ongoing';
});

// Virtual for spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
  if (this.capacity === 0) return 'Unlimited';
  return Math.max(0, this.capacity - this.registeredCount);
});

module.exports = mongoose.model('Event', eventSchema);
