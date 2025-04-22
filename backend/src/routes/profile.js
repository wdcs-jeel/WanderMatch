const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Update profile
router.put('/update', auth, [
  body('fullName').optional().notEmpty(),
  body('dateOfBirth').optional().isISO8601(),
  body('travelType').optional().isIn(['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad']),
  body('lookingFor').optional().isArray(),
  body('travelStyle').optional().isArray(),
  body('bio').optional().isString(),
  body('topDestinations').optional().isArray(),
  body('languages').optional().isArray()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = req.body;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload identity document
router.post('/upload-identity', auth, async (req, res) => {
  try {
    const { documentUrl } = req.body;
    
    if (!documentUrl) {
      return res.status(400).json({ message: 'Document URL is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          identityDocument: documentUrl,
          identityVerified: false // Will be set to true after admin verification
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Identity document upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile photos
router.post('/upload-photos', auth, async (req, res) => {
  try {
    const { photoUrls } = req.body;
    
    if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
      return res.status(400).json({ message: 'At least one photo URL is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePhotos: photoUrls } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Profile photos upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 