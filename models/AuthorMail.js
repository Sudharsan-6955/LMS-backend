const mongoose = require('mongoose');

const authorMailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  degree: { type: String, required: true },
  skill: { type: String, required: true },
  resumePath: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AuthorMail', authorMailSchema);
