
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    trim: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  mfaSecret: {
    type: String
  },
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String
  },
  sessions: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    ipAddress: String,
    userAgent: String
  }],
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ roleId: 1 });

module.exports = mongoose.model('User', userSchema);
