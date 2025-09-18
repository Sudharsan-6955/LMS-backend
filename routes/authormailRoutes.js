const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const AuthorMail = require('../models/AuthorMail');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed!'));
  }
});

// POST /api/authormail
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, degree, skill } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Resume file is required and must be PDF.' });
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required.' });
    // Check for duplicate (name+degree+skill)
    const duplicate = await AuthorMail.findOne({
      name: name.trim(),
      degree: degree,
      skill: skill
    });
    if (duplicate) {
      return res.status(409).json({ message: 'Already applied with these details.' });
    }
    const relativeResumePath = path.join('uploads/resumes', req.file.filename).replace(/\\/g, '/');
    const newMail = new AuthorMail({
      name: name.trim(),
      degree,
      skill,
      resumePath: relativeResumePath
    });
    await newMail.save();
    res.status(201).json({ message: 'Application received!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/authormail (admin view)
router.get('/', async (req, res) => {
  try {
    const mails = await AuthorMail.find().sort({ createdAt: -1 });
    res.json(mails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
