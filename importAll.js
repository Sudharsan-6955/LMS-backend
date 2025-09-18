require("dotenv").config();
const mongoose = require("mongoose");

// DB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Import Models
const Author = require("./models/Author");
const Category = require("./models/Category");
const CourseDetail = require("./models/CourseDetail");
const CourseList = require("./models/CourseList");

// Import Data
const authorData = require("./data/authorData");
const categoryData = require("./data/categoryData");
const courseData = require("./data/courseData");
const courseListData = require("./data/courseId");

// Import Function
const importData = async () => {
  try {
    await Author.deleteMany();
    await Category.deleteMany();
    await CourseDetail.deleteMany();
    await CourseList.deleteMany();

    // Convert authorData object to array
    const authorsArray = Object.values(authorData);

    await Author.insertMany(authorsArray);
    await Category.insertMany(categoryData);
    await CourseDetail.insertMany(courseData);
    await CourseList.insertMany(courseListData);

    console.log("✅ All data imported successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Data import failed:", err);
    process.exit(1);
  }
};

importData();
