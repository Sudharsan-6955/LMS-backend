const mongoose = require("mongoose");

const courseListSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("CourseList", courseListSchema);
