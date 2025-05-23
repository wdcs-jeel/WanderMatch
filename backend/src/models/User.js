const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    sparse: true
  },
  
  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  
  // Profile details
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  interests: [{
    type: String,
    trim: true
  }],
  
  // Travel preferences
  travelType: {
    type: String,
    enum: ['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad']
  },
  lookingFor: [{
    type: String,
    enum: ['Romance', 'Friendship', 'Adventure Partners', 'Local Guides']
  }],
  travelStyle: [{
    type: String,
    enum: ['Luxury', 'Budget', 'Adventure', 'Cultural', 'Relaxation', 'Foodie']
  }],
  topDestinations: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  
  // Verification
  identityVerified: {
    type: Boolean,
    default: false
  },
  identityDocument: {
    type: {
      data: Buffer,
      contentType: String
    },
    required: true
  },
  
  // Media
  profilePhotos: [{
    type: String // URLs to stored photos
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 