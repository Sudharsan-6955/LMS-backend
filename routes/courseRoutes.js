
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { enrollInCourse, deleteCourse } = require('../controllers/courseController');
const Course = require('../models/CourseDetail');
const adminAuth = require('../middleware/adminAuth');

// Get all courses (for instructor stats)
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all courses' });
  }
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Enroll in course
router.post('/enroll', enrollInCourse);

// Get all courses
// Get last 6 uploaded courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).limit(6);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Delete course
router.delete('/:id', adminAuth, deleteCourse);

// ✅ Create course with full schema support
router.post('/create', adminAuth, require('../controllers/courseController').createCourse);

// ✅ Get distinct values for a given field
router.get('/distinct/:field', async (req, res) => {
  try {
    const field = req.params.field;
    const values = await Course.distinct(field);
    res.json(values);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching distinct values' });
  }
});

module.exports = router;
