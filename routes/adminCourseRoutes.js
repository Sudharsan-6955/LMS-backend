const express = require('express');
const Course = require('../models/Course');
const adminProtect = require('../middleware/adminProtect');

const router = express.Router();

router.post('/', adminProtect, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json(course);
});

router.put('/:id', adminProtect, async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', adminProtect, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: 'Course deleted' });
});

module.exports = router;
