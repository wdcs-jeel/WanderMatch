const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Update profile
router.put('/update', auth, [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('bio').optional().trim(),
  body('travelType').optional().isIn(['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad']),
  body('lookingFor').optional().isArray(),
  body('travelStyle').optional().isArray(),
  body('languages').optional().isArray()
], async (req, res) => {
  try {
    console.log('Profile update request received:', {
      userId: req.user._id,
      updateData: req.body,
      currentUser: req.user.fullName
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = { ...req.body };
    
    // Ensure fullName is properly handled
    if (updateFields.fullName) {
      updateFields.fullName = updateFields.fullName.trim();
      console.log('Updating fullName to:', updateFields.fullName);
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: {
          ...updateFields,
          updatedAt: new Date()
        }
      },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select('-password');

    if (!user) {
      console.error('User not found for update:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully:', {
      userId: user._id,
      updatedFields: Object.keys(updateFields),
      fullName: user.fullName,
      previousName: req.user.fullName
    });

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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