const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  author: String,
  reviewCount: String,
  videoLink: String,
  categoryList: Array,
  overview: Array,
  whatYouWillLearn: Array,
  videoContent: Array,
  price: Number,
  isPaid: Boolean,
  level: String,
  duration: String,
  classes: String,
  lessons: Number,
  quizzes: Number,
  passPercentage: Number,
  certificate: String,
  language: String
});

module.exports = mongoose.model("Course", courseSchema);
