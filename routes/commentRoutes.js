const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET all comments for a course
router.get('/:id', commentController.getComments);
// POST a new comment for a course
router.post('/:id', commentController.addComment);

// No changes needed here. Remove console.log from commentController to stop terminal output.

module.exports = router;
