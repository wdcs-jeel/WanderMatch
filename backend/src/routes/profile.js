const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Update profile
router.put('/update', auth, upload.single('identityDocument'), [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ min: 0, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('bio').optional().trim(),
  body('travelType').optional().isIn(['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad']),
  body('lookingFor').optional().custom((value) => {
    try {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) return false;
      return array.every(item => ['Friendship', 'Local Guides', 'Adventure Partners', 'Romance'].includes(item));
    } catch {
      return false;
    }
  }).withMessage('Invalid lookingFor values'),
  body('travelStyle').optional().custom((value) => {
    try {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) return false;
      return array.every(item => ['Budget', 'Luxury', 'Adventure', 'Cultural', 'Relaxation', 'Foodie'].includes(item));
    } catch {
      return false;
    }
  }).withMessage('Invalid travelStyle values'),
  body('languages').optional().custom((value) => {
    try {
      const array = JSON.parse(value);
      return Array.isArray(array) && array.every(item => typeof item === 'string');
    } catch {
      return false;
    }
  }).withMessage('Invalid languages format')
], async (req, res) => {
  try {
    console.log('Profile update request received:', {
      userId: req.user._id,
      updateData: req.body,
      hasFile: !!req.file,
      currentUser: req.user.fullName,
      fileDetails: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = { ...req.body };
    
    // Handle identity document if uploaded
    if (req.file) {
      console.log('Processing new identity document:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      updateFields.identityDocument = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      updateFields.identityVerified = false; // Reset verification status
    } else {
      // If no new file is uploaded, remove the identityDocument field
      delete updateFields.identityDocument;
    }
    
    // Process array fields
    ['lookingFor', 'travelStyle', 'languages'].forEach(field => {
      if (updateFields[field]) {
        try {
          updateFields[field] = JSON.parse(updateFields[field]);
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
          delete updateFields[field];
        }
      }
    });
    
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

    // Convert identity document to base64 for response
    const responseUser = user.toObject();
    if (user.identityDocument && user.identityDocument.data) {
      responseUser.identityDocument = {
        data: user.identityDocument.data.toString('base64'),
        contentType: user.identityDocument.contentType
      };
    }

    console.log('Profile updated successfully:', {
      userId: user._id,
      updatedFields: Object.keys(updateFields),
      fullName: user.fullName,
      previousName: req.user.fullName,
      hasNewImage: !!req.file,
      hasIdentityDocument: !!responseUser.identityDocument,
      identityDocumentSize: responseUser.identityDocument ? responseUser.identityDocument.data.length : 0
    });

    res.json(responseUser);
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