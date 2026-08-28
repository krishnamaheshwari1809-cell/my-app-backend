const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

const Content = require('./models/Content');
const BlogPost = require('./models/BlogPost');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

function checkAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/api/admin/verify', checkAdmin, (req, res) => {
  res.json({ ok: true });
});

// ---------- CONTACT FORM (also saves as Lead) ----------
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await Lead.create({ name, email, message });
  } catch (err) {
    console.error('Lead save error:', err);
  }
  try {
    await resend.emails.send({
      from: 'Website Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      reply_to: email,
      subject: `New Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- LEADS ----------
app.get('/api/leads', checkAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/leads/:id', checkAdmin, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- IMAGE UPLOAD ----------
app.post('/api/upload', upload.single('image'), async (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  try {
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'website-uploads',
      format: 'webp',
      quality: 'auto:eco',
    });
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- SITE CONTENT ----------
app.get('/api/content', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create({});
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/content', checkAdmin, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create(req.body);
    } else {
      Object.assign(content, req.body);
      await content.save();
    }
    res.json(content);
  } catch (error) {
    console.error('Content save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- BLOG POSTS ----------
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', checkAdmin, async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', checkAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', checkAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});