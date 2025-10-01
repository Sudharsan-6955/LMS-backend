require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// ✅ Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));


// Root route for Railway health check and browser visits
app.get('/', (req, res) => {
  res.send('LMS Backend is running!');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/categories', categoryRoutes); // ✅ Good

const commentRoutes = require('./routes/commentRoutes');
const authorRoutes = require('./routes/authorRoutes');

const studentEmailRoutes = require('./routes/studentEmailRoutes');
const authormailRoutes = require('./routes/authormailRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/comments', commentRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/student-emails', studentEmailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/authormail', authormailRoutes);
app.use('/api/feedback', feedbackRoutes);

// Serve resumes statically
const path = require('path');
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));



// ✅ MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// Add a timeout to prevent hanging
const connectWithTimeout = async () => {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('MongoDB connection timed out')), 20000));
    await Promise.race([
      mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      timeoutPromise
    ]);
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectWithTimeout();