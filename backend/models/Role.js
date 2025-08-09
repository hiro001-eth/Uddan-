
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      'dashboard.view',
      'jobs.create', 'jobs.read', 'jobs.update', 'jobs.delete', 'jobs.bulk',
      'applications.read', 'applications.update', 'applications.delete',
      'events.create', 'events.read', 'events.update', 'events.delete',
      'testimonials.create', 'testimonials.read', 'testimonials.update', 'testimonials.delete',
      'pages.create', 'pages.read', 'pages.update', 'pages.delete', 'pages.publish',
      'media.upload', 'media.read', 'media.delete', 'media.manage',
      'users.create', 'users.read', 'users.update', 'users.delete',
      'roles.create', 'roles.read', 'roles.update', 'roles.delete',
      'settings.read', 'settings.update',
      'audit.read', 'audit.export',
      'theme.read', 'theme.update',
      'security.read', 'security.manage',
      'all'
    ]
  }],
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
