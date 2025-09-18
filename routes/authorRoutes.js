const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// GET /api/authors - fetch all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    // Filter unique names (case-insensitive)
    const seen = new Set();
    const uniqueAuthors = authors.filter(a => {
      const nameLower = a.name.trim().toLowerCase();
      if (seen.has(nameLower)) return false;
      seen.add(nameLower);
      return true;
    });
    res.json(uniqueAuthors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching authors' });
  }
});

// You can add POST/PUT/DELETE endpoints here as needed

module.exports = router;
