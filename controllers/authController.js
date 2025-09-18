const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // fallback

// Register controller
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists by name or email
        const existingUser = await Student.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await Student.create({ name, email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user });
    } catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login controller
exports.login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await Student.findOne({ name });

        if (!user) {
            return res.status(404).json({ message: "User not found. Redirecting to signup..." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, user });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
