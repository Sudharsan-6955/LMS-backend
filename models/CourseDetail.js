const mongoose = require("mongoose");

const courseDetailSchema = new mongoose.Schema({
  // MongoDB will automatically add _id: ObjectId
  title: String,
  imgUrl: String,
  imgAlt: String,
  description: String,
  author: {
    name: String,
    image: String
  },
  authorDetails: mongoose.Schema.Types.Mixed,
  reviewCount: String,
  videoLink: String,
  categoryList: [
    {
      link: String,
      text: String,
      className: String
    }
  ],
  overview: [String],
  whatYouWillLearn: [String],
  videoContent: [
    {
      title: String,
      duration: String,
      lessons: [
        {
          title: String,
          videoUrl: String,
          duration: String
        }
      ]
    }
  ],
  price: Number,
  isPaid: Boolean,
  level: String,
  duration: String,
  classes: String,
  cate: String,
  skill: String,
  category: String,
  lessons: Number,
  quizzes: Number,
  passPercentage: Number,
  certificate: String,
  language: String
}, { timestamps: true });

module.exports = mongoose.model("CourseDetail", courseDetailSchema);
