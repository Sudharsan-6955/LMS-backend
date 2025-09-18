const mongoose = require("mongoose");

const courseListSchema = new mongoose.Schema({
  id: String,
  imgUrl: String,
  imgAlt: String,
  cate: String,
  title: String,
  totalLeson: String,
  schdule: String,
  authorImgUrl: String,
  authorImgAlt: String,
  authorName: String,
  btnText: String,
  category: String,
  price: Number,
  isPaid: Boolean,
  skill: String,
  language: String,
  reviewCount: String
});

module.exports = mongoose.model("CourseList", courseListSchema);
