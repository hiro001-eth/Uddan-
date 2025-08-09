
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  width: Number,
  height: Number,
  path: {
    type: String,
    required: true
  },
  storageBackend: {
    type: String,
    enum: ['local', 's3', 'cloudinary'],
    default: 'local'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  altText: {
    type: String,
    trim: true
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  cdnUrl: String,
  thumbnails: {
    small: String,
    medium: String,
    large: String
  }
}, {
  timestamps: true
});

mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ tags: 1 });

module.exports = mongoose.model('Media', mediaSchema);
