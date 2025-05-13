const express = require('express');
const { body, validationResult } = require('express-validator');
const Place = require('../models/Place');
const router = express.Router();

router.post('/', [
  body('places').isArray({ min: 1 }).withMessage('places must be a non-empty array'),
  body('places.*._id').isNumeric().withMessage('_id must be numeric'),
  body('places.*.placeName').notEmpty().withMessage('placeName is required'),
  body('places.*.experience').notEmpty().withMessage('experience is required'),
  body('places.*.travelWith').notEmpty().withMessage('travelWith is required'),
  body('places.*.travelBy').notEmpty().withMessage('travelBy is required'),
  body('places.*.userId').notEmpty().withMessage('userId is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { places } = req.body;
    console.log('Received places:', places);

    for (const place of places) {
      await Place.updateOne(
        { _id: place._id },
        { $set: place },
        { upsert: true }
      );
    }

    res.status(200).json({ message: 'Trips synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Failed to sync trips' });
  }
});

// GET all trips by userId
router.get('/:userId', async (req, res) => {
  console.log("GET /api/sync/:userId called");
  const { userId } = req.params;
  console.log(userId);
  try {
    const trips = await Place.find({ userId });
    console.log("backend trips--",trips)
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
});

// DELETE route to remove a place by _id
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id from backend",id)
    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
