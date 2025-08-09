
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
