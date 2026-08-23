const mongoose = require('mongoose');
require('dotenv').config();
const Content = require('./models/Content');
const BlogPost = require('./models/BlogPost');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Content.deleteMany({});
  await Content.create({
    hero: {
      badge: '👋 Welcome to my portfolio',
      title: "Hi, I'm Krishna",
      subtitle: 'Digital Marketing & Web Development Specialist — helping businesses grow online through SEO, SMM, SEM, Meta Ads and modern websites.',
    },
    stats: [
      { number: '5+', label: 'Services Offered' },
      { number: '100%', label: 'Client-Focused' },
      { number: '24/7', label: 'Support' },
      { number: '1:1', label: 'Direct Communication' },
    ],
    services: [
      { icon: '🔍', title: 'SEO', desc: 'I implement on-page, off-page, and technical SEO strategies to help your website rank higher on Google.' },
      { icon: '📱', title: 'SMM', desc: "I build your brand's presence on Instagram, Facebook, and LinkedIn." },
      { icon: '🎯', title: 'SEM', desc: 'I manage Google Ads and paid search campaigns to bring targeted traffic.' },
      { icon: '📢', title: 'Meta Ads', desc: 'I run precisely targeted campaigns on Facebook and Instagram Ads.' },
      { icon: '💻', title: 'Web Development', desc: 'I build modern, fast, and mobile-friendly websites.' },
    ],
    whyChoose: [
      { icon: '⚡', title: 'Fast Turnaround', desc: 'Quick, efficient delivery without compromising on quality.' },
      { icon: '🎯', title: 'Result-Driven', desc: 'Every strategy is built around measurable business outcomes.' },
      { icon: '🤝', title: 'Direct Communication', desc: 'You work with me directly — no middlemen, no delays.' },
      { icon: '💡', title: 'Custom Strategy', desc: 'No templates — every plan is built around your specific goals.' },
    ],
    testimonials: [
      { text: 'Working on our website and marketing was smooth from start to finish.', name: 'Client Feedback', role: 'Coming Soon' },
      { text: 'Great attention to detail and always available to explain the strategy.', name: 'Client Feedback', role: 'Coming Soon' },
      { text: 'Exactly what a growing business needs.', name: 'Client Feedback', role: 'Coming Soon' },
    ],
    about: {
      heading: 'Krishna Maheshwari',
      paragraph1: "I help businesses grow their online presence through a combination of performance marketing and modern web development.",
      paragraph2: 'My work spans SEO, Social Media Marketing, Search Engine Marketing, and Meta Ads — paired with the ability to design and build websites.',
      skills: ['SEO', 'SMM', 'SEM', 'Meta Ads', 'Web Development'],
    },
    contact: {
      email: 'krishnamaheshwari597@gmail.com',
      phone: '+919953792977',
    },
  });

  await BlogPost.deleteMany({});
  await BlogPost.insertMany([
    {
      title: '5 Basic SEO Tips Every Business Should Follow',
      excerpt: 'Simple yet effective SEO practices to improve your website ranking...',
      content: 'Full blog content coming soon.',
      image: '',
    },
    {
      title: 'How to Grow Your Brand with Social Media Marketing',
      excerpt: 'Proven strategies to boost organic reach on Instagram and Facebook...',
      content: 'Full blog content coming soon.',
      image: '',
    },
    {
      title: 'Meta Ads vs Google Ads — Which is Better for Your Business?',
      excerpt: 'The pros, cons, and when to use each platform...',
      content: 'Full blog content coming soon.',
      image: '',
    },
  ]);

  console.log('Database seeded successfully!');
  process.exit();
}

seed();