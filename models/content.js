const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  hero: {
    badge: String,
    title: String,
    subtitle: String,
  },
  stats: [
    {
      number: String,
      label: String,
    },
  ],
  services: [
    {
      icon: String,
      title: String,
      desc: String,
    },
  ],
  whyChoose: [
    {
      icon: String,
      title: String,
      desc: String,
    },
  ],
  testimonials: [
    {
      text: String,
      name: String,
      role: String,
    },
  ],
  about: {
    heading: String,
    paragraph1: String,
    paragraph2: String,
    skills: [String],
  },
  contact: {
    email: String,
    phone: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);