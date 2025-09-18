const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Student = require("./models/student");

// 📧 Configure Nodemailer (Update with your Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sudha12@gmail.com",         // ✅ Replace with your Gmail
    pass: "123",           // ✅ Replace with Gmail App Password
  },
});

// ✅ SEND RESET LINK
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const token = jwt.sign({ id: user._id }, "reset-secret", { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: '"LMS Support" <yourgmail@gmail.com>',
      to: email,
      subject: "Reset your LMS password",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><small>This link will expire in 15 minutes.</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link sent to your email." });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: "Failed to send reset link" });
  }
});

// ✅ RESET PASSWORD USING TOKEN
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, "reset-secret");
    const hashedPassword = await bcrypt.hash(password, 10);
    await Student.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(400).json({ message: "Invalid or expired reset token" });
  }
});

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Student.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    const token = jwt.sign(
      { id: newStudent._id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
      },
    });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    if (!name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Student.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
