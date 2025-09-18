
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');

// Get all enrollments (for instructor stats)
router.get('/all', async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching all enrollments' });
  }
});

// POST: Enroll in a course
router.post('/', async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: 'userId and courseId are required' });
  }

  try {
    const existing = await Enrollment.findOne({ userId, courseId });

    if (existing) {
      return res.status(409).json({ message: 'Already enrolled' });
    }

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Server error during enrollment' });
  }
});

// GET: Enrolled courses by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId });
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
});

// GET: Check enrollment
router.get('/check', async (req, res) => {
  const { userId, courseId } = req.query;

  if (!userId || !courseId) {
    return res.status(400).json({ error: 'userId and courseId are required' });
  }

  try {
    const isEnrolled = await Enrollment.findOne({ userId, courseId });
    res.status(200).json({ enrolled: !!isEnrolled });
  } catch (err) {
    res.status(500).json({ error: 'Error checking enrollment' });
  }
});

module.exports = router;
