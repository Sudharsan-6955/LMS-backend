const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken'); // your helper

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    // ✅ Print the actual error to the terminal
    console.error('❌ Admin Signup Error:', err);

    // ✅ Send actual error message in response
    res.status(500).json({ message: err.message || 'Signup failed' });
  }
});


