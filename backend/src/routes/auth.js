const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Register route
router.post('/register', 
  upload.single('identityDocument'),
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date format'),
    body('travelType').isIn(['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad']).withMessage('Invalid travel type'),
    body('lookingFor').custom((value) => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch (e) {
        return false;
      }
    }).withMessage('Invalid lookingFor format'),
    body('travelStyle').custom((value) => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch (e) {
        return false;
      }
    }).withMessage('Invalid travelStyle format'),
    body('languages').custom((value) => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch (e) {
        return false;
      }
    }).withMessage('Invalid languages format')
  ],
  async (req, res) => {
    try {
      console.log('Received registration request:', {
        email: req.body.email,
        fullName: req.body.fullName,
        hasIdentityDocument: !!req.file
      });

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { 
        email, 
        password, 
        fullName, 
        dateOfBirth, 
        travelType, 
        lookingFor, 
        travelStyle, 
        bio, 
        languages
      } = req.body;

      if (!req.file) {
        console.error('Identity document missing');
        return res.status(400).json({ message: 'Identity document is required' });
      }

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        console.error('User already exists:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Process arrays from form data
      let lookingForArray = [];
      let travelStyleArray = [];
      let languagesArray = [];

      try {
        lookingForArray = JSON.parse(lookingFor || '[]');
        travelStyleArray = JSON.parse(travelStyle || '[]');
        languagesArray = JSON.parse(languages || '[]');
      } catch (e) {
        console.error('Error parsing arrays:', e);
        return res.status(400).json({ message: 'Invalid data format for arrays' });
      }

      console.log('Creating new user...');
      // Create new user
      user = new User({
        email,
        password,
        fullName,
        dateOfBirth,
        travelType,
        lookingFor: lookingForArray,
        travelStyle: travelStyleArray,
        bio,
        languages: languagesArray,
        identityDocument: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        },
        identityVerified: false
      });

      // Save user
      await user.save();
      console.log('User saved successfully:', user._id);

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          travelType: user.travelType,
          lookingFor: user.lookingFor,
          travelStyle: user.travelStyle,
          bio: user.bio,
          languages: user.languages,
          identityDocument: {
            data: user.identityDocument.data.toString('base64'),
            contentType: user.identityDocument.contentType
          },
          identityVerified: user.identityVerified
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }
);

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return complete user profile without password
    const userProfile = user.toObject();
    delete userProfile.password;

    res.json({
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 