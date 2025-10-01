// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course"); // Ensure path is correct

// GET /api/courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    const formattedCourses = courses.map(course => ({
      _id: course._id,
      title: course.title,
      price: course.price,
      imgUrl: course.imgUrl,
      imgAlt: course.imgAlt || course.title,
      category: course.category || "Uncategorized",
      rating: course.rating || 5,
      reviewCount: course.reviewCount || 0,
      totalLesson: course.totalLesson || 0,
      schedule: course.schedule || "Flexible",
      authorName: course.authorName || "Instructor",
      authorImgUrl: course.authorImgUrl || "https://via.placeholder.com/50",
      authorImgAlt: course.authorImgAlt || "Author",
      skill: course.skill || "All Levels",
      language: course.language || "English",
      btnText: course.btnText || "View Details",
    }));

    res.json(formattedCourses);
  } catch (err) {
    console.error("Error in GET /api/courses:", err.message);
    res.status(500).json({ error: "Server error while fetching courses" });
  }
});

module.exports = router;

// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  category: String,
  // ...other fields...
});

module.exports = mongoose.model('Course', courseSchema);
