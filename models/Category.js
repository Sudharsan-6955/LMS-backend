const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  imgUrl: String,
  imgAlt: String,
  title: String,
  count: String,
});

module.exports = mongoose.model("Category", categorySchema);
