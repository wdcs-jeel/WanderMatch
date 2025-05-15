// models/Place.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback: String,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
