// // createAdmin.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// require('dotenv').config(); // if you're using .env for DB connection
// const Admin = require('./models/Admin'); // adjust path if different

// const createAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ MongoDB connected');

//     const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
//     if (existingAdmin) {
//       console.log('⚠️ Admin already exists');
//       return;
//     }

//     const hashedPassword = await bcrypt.hash('admin123', 10); // set your password here

//     const admin = new Admin({
//       email: 'admin@example.com',
//       password: hashedPassword,
//     });

//     await admin.save();
//     console.log('✅ Admin user created successfully');
//   } catch (error) {
//     console.error('❌ Error creating admin:', error.message);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// createAdmin();
