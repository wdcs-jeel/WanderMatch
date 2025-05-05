const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').notEmpty(),
  body('dateOfBirth').isISO8601(),
  body('travelType').isIn(['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad']),
  body('lookingFor').custom((value) => {
    // Handle both array and string formats
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') return true;
    return false;
  }),
  body('travelStyle').custom((value) => {
    // Handle both array and string formats
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') return true;
    return false;
  }),
  body('languages').custom((value) => {
    // Handle both array and string formats
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') return true;
    return false;
  })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
      topDestinations,
      languages
    } = req.body;

    // Convert string arrays to actual arrays if needed
    const formattedData = {
      email,
      password,
      fullName,
      dateOfBirth,
      travelType,
      lookingFor: Array.isArray(lookingFor) ? lookingFor : lookingFor.split(',').map(item => item.trim()),
      travelStyle: Array.isArray(travelStyle) ? travelStyle : travelStyle.split(',').map(item => item.trim()),
      bio,
      topDestinations: Array.isArray(topDestinations) ? topDestinations : (topDestinations ? topDestinations.split(',').map(item => item.trim()) : []),
      languages: Array.isArray(languages) ? languages : languages.split(',').map(item => item.trim())
    };

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User(formattedData);

    // Save user to database
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return complete user profile without password
    const userProfile = user.toObject();
    delete userProfile.password;

    res.status(201).json({
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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