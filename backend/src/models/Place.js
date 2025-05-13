const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  _id: Number,
  placeName: String,
  experience: String,
  travelWith: String,
  travelBy: String,
  userId: String
});

const Place = mongoose.model('Place', tripSchema);

module.exports = Place;