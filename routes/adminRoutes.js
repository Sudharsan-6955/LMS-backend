const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/admin/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('❌ Admin Signup Error:', err);
    res.status(500).json({ message: err.message || 'Signup failed' });
  }
});

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Add isAdmin: true to the token payload
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('❌ Admin login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
