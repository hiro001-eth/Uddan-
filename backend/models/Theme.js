
const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  colors: {
    primary: { type: String, default: '#3B82F6' },
    secondary: { type: String, default: '#10B981' },
    accent: { type: String, default: '#F59E0B' },
    background: { type: String, default: '#FFFFFF' },
    surface: { type: String, default: '#F9FAFB' },
    text: { type: String, default: '#111827' },
    textSecondary: { type: String, default: '#6B7280' }
  },
  fonts: {
    primary: { type: String, default: 'Inter' },
    secondary: { type: String, default: 'Inter' },
    sizes: {
      xs: { type: String, default: '0.75rem' },
      sm: { type: String, default: '0.875rem' },
      base: { type: String, default: '1rem' },
      lg: { type: String, default: '1.125rem' },
      xl: { type: String, default: '1.25rem' },
      '2xl': { type: String, default: '1.5rem' },
      '3xl': { type: String, default: '1.875rem' }
    }
  },
  spacing: {
    xs: { type: String, default: '0.25rem' },
    sm: { type: String, default: '0.5rem' },
    md: { type: String, default: '1rem' },
    lg: { type: String, default: '1.5rem' },
    xl: { type: String, default: '3rem' }
  },
  customCSS: String,
  isActive: {
    type: Boolean,
    default: false
  },
  darkMode: {
    enabled: { type: Boolean, default: false },
    colors: {
      primary: { type: String, default: '#60A5FA' },
      background: { type: String, default: '#111827' },
      surface: { type: String, default: '#1F2937' },
      text: { type: String, default: '#F9FAFB' }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);
