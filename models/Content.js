const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.models.Content || mongoose.model('Content', contentSchema);