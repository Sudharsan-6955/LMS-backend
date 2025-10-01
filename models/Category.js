const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    imgUrl: { type: String, default: "" },
    imgAlt: { type: String, default: "" },
    // numerical count stored in Atlas
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
