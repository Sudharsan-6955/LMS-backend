const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  degi: String,
  desc: String,
  image: String,
  socialList: [
    {
      link: String,
      iconName: String,
      className: String,
    },
  ],
});

module.exports = mongoose.model("Author", authorSchema);
