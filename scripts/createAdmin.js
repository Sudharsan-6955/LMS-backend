const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load env variables
dotenv.config();

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'sudharsan638294@example.com' });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
    } else {
      const hashedPassword = await bcrypt.hash('sudharsan2006', 10);
      const admin = await Admin.create({
        email: 'sudharsan638294@example.com',
        password: hashedPassword,
      });

      console.log('✅ Admin created:', admin.email);
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
