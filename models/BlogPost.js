const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);