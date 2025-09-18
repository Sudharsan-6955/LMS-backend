const express = require('express');
const router = express.Router();
const StudentEmail = require('../models/StudentEmail');

// POST /api/student-emails
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    const exists = await StudentEmail.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already subscribed' });
    const newEmail = new StudentEmail({ email });
    await newEmail.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
