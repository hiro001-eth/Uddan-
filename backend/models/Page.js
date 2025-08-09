
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  canonicalUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  publishedAt: {
    type: Date
  },
  scheduledAt: {
    type: Date
  },
  featuredImage: {
    type: String
  },
  blocks: [{
    type: {
      type: String,
      enum: ['hero', 'text', 'image', 'cta', 'testimonials', 'jobs']
    },
    content: mongoose.Schema.Types.Mixed,
    order: Number
  }],
  seoKeywords: [String],
  language: {
    type: String,
    enum: ['en', 'ne'],
    default: 'en'
  }
}, {
  timestamps: true
});

pageSchema.index({ slug: 1 });
pageSchema.index({ status: 1 });
pageSchema.index({ authorId: 1 });

module.exports = mongoose.model('Page', pageSchema);
