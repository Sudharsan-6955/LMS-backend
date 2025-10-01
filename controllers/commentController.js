const Comment = require('../models/Comment');

// Get all comments for a course
exports.getComments = async (req, res) => {
  try {
    console.log('Fetching comments for courseId:', req.params.id); // Add this line
    const comments = await Comment.find({ courseId: req.params.id }).sort({ date: -1 });
    console.log('Comments found:', comments); // Add this line
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err); // Add this line for detailed error logging
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
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
    console.error('Error adding comment:', err); // Add this line for detailed error logging
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};
