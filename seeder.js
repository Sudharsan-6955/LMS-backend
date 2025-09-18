// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB model
const Course = require('./models/Course'); // 👉 Replace with your actual path if different

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected for seeding");
}).catch(err => {
  console.error("Mongo connection failed", err);
});

// Sample course data
const sampleCourses = [
  {
    title: "Advanced Photoshop",
    category: "Design",
    price: 110,
    language: "English",
    skill: "Intermediate",
    authorName: "Sophia Williams",
    authorImgUrl: "/images/course/author/01.jpg",
    authorImgAlt: "Sophia",
    totalLesson: 35,
    schedule: "3 weeks",
    imgUrl: "/images/course/01.jpg",
    imgAlt: "Advanced Photoshop",
    btnText: "Enroll Now",
    reviewCount: 125,
  },
  {
    title: "Full Stack Web Development",
    category: "Development",
    price: 0,
    language: "Tamil",
    skill: "Beginner",
    authorName: "Arun Kumar",
    authorImgUrl: "/images/course/author/02.jpg",
    authorImgAlt: "Arun",
    totalLesson: 42,
    schedule: "5 weeks",
    imgUrl: "/images/course/02.jpg",
    imgAlt: "Web Dev",
    btnText: "Start Course",
    reviewCount: 99,
  },
  {
    title: "Digital Marketing Mastery",
    category: "Marketing",
    price: 150,
    language: "English",
    skill: "Advanced",
    authorName: "Rekha R.",
    authorImgUrl: "/images/course/author/03.jpg",
    authorImgAlt: "Rekha",
    totalLesson: 28,
    schedule: "4 weeks",
    imgUrl: "/images/course/03.jpg",
    imgAlt: "Digital Marketing",
    btnText: "Join Now",
    reviewCount: 210,
  }
];

// Insert data
const seedCourses = async () => {
  try {
    await Course.deleteMany(); // optional: clears old data
    await Course.insertMany(sampleCourses);
    console.log("✅ Sample courses inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedCourses();
