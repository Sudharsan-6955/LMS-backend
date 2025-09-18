const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback
router.post('/', async (req, res) => {
	try {
		const { name, email, number, subject, message } = req.body;
		if (!name || !email || !number || !subject || !message) {
			return res.status(400).json({ message: 'All fields are required.' });
		}
		const feedback = new Feedback({ name, email, number, subject, message });
		await feedback.save();
		res.status(201).json({ message: 'Feedback submitted successfully!' });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// GET /api/feedback (admin view)
router.get('/', async (req, res) => {
	try {
		const feedbacks = await Feedback.find().sort({ createdAt: -1 });
		res.json(feedbacks);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
