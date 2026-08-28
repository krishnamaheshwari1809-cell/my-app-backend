const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);