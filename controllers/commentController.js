const Comment = require('../models/Comment');

// Get all comments for a course
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ courseId: req.params.id }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Add a new comment to a course
exports.addComment = async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;
    if (!name || !email || !message || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const comment = new Comment({
      courseId: req.params.id,
      name,
      email,
      subject,
      message,
      rating
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};
