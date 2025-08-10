
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  description: {
    type: String,
    trim: true
  },
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    default: 'string'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isEditable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
settingSchema.index({ key: 1 });
settingSchema.index({ category: 1 });
settingSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Setting', settingSchema);
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Site Information
  siteName: {
    type: String,
    default: 'Uddaan Consultancy'
  },
  siteDescription: {
    type: String,
    default: 'Your gateway to Gulf career opportunities'
  },
  siteKeywords: {
    type: String,
    default: 'gulf jobs, dubai jobs, qatar jobs, saudi jobs, career consultancy'
  },
  siteLogo: {
    type: String
  },
  favicon: {
    type: String
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  alternatePhone: {
    type: String
  },
  whatsappNumber: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Business Hours
  businessHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String,
    telegram: String
  },
  
  // Email Settings
  emailSettings: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromEmail: String,
    fromName: String,
    replyToEmail: String
  },
  
  // SEO Settings
  seoSettings: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    googleAnalyticsId: String,
    googleTagManagerId: String,
    facebookPixelId: String,
    enableSitemap: { type: Boolean, default: true },
    enableRobots: { type: Boolean, default: true }
  },
  
  // Application Settings
  applicationSettings: {
    allowMultipleApplications: { type: Boolean, default: false },
    maxApplicationsPerUser: { type: Number, default: 5 },
    requireLogin: { type: Boolean, default: false },
    autoApproveApplications: { type: Boolean, default: false },
    sendApplicationConfirmation: { type: Boolean, default: true },
    allowApplicationEditing: { type: Boolean, default: true },
    applicationEditTimeLimit: { type: Number, default: 24 } // hours
  },
  
  // Job Settings
  jobSettings: {
    jobsPerPage: { type: Number, default: 12 },
    enableJobAlerts: { type: Boolean, default: true },
    enableJobSharing: { type: Boolean, default: true },
    showJobViews: { type: Boolean, default: true },
    showApplicationCount: { type: Boolean, default: true },
    autoExpireJobs: { type: Boolean, default: true },
    jobExpiryDays: { type: Number, default: 30 }
  },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    adminNotifications: { type: Boolean, default: true },
    userNotifications: { type: Boolean, default: true }
  },
  
  // Security Settings
  securitySettings: {
    enableTwoFactor: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 60 }, // minutes
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 15 }, // minutes
    passwordMinLength: { type: Number, default: 8 },
    requirePasswordChange: { type: Boolean, default: false },
    passwordChangeInterval: { type: Number, default: 90 } // days
  },
  
  // File Upload Settings
  uploadSettings: {
    maxFileSize: { type: Number, default: 10 }, // MB
    allowedFileTypes: {
      type: [String],
      default: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
    },
    enableImageCompression: { type: Boolean, default: true },
    storageProvider: {
      type: String,
      enum: ['local', 'aws', 'cloudinary', 'google'],
      default: 'local'
    }
  },
  
  // Payment Settings (for future use)
  paymentSettings: {
    enablePayments: { type: Boolean, default: false },
    currency: { type: String, default: 'USD' },
    paymentProviders: {
      stripe: {
        enabled: { type: Boolean, default: false },
        publishableKey: String,
        secretKey: String
      },
      paypal: {
        enabled: { type: Boolean, default: false },
        clientId: String,
        clientSecret: String
      }
    }
  },
  
  // Maintenance Mode
  maintenanceMode: {
    enabled: { type: Boolean, default: false },
    message: {
      type: String,
      default: 'Site is under maintenance. Please check back later.'
    },
    allowedIPs: [String],
    estimatedDowntime: String
  },
  
  // Analytics Settings
  analyticsSettings: {
    enableTracking: { type: Boolean, default: true },
    trackPageViews: { type: Boolean, default: true },
    trackEvents: { type: Boolean, default: true },
    trackApplications: { type: Boolean, default: true },
    trackJobViews: { type: Boolean, default: true }
  },
  
  // Cache Settings
  cacheSettings: {
    enableCaching: { type: Boolean, default: true },
    cacheTimeout: { type: Number, default: 3600 }, // seconds
    cacheProvider: {
      type: String,
      enum: ['memory', 'redis', 'file'],
      default: 'memory'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
