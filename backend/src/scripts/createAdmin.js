// backend/src/scripts/createAdmin.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/database.js';

const createAdmin = async () => {
  await connectDB();
  
  const adminExists = await User.findOne({ email: 'admin@freelancehub.com' });
  if (adminExists) {
    console.log('Admin already exists');
    process.exit();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin123!', salt);

  await User.create({
    name: 'Admin',
    email: 'admin@freelancehub.com',
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
    subscription: {
      plan: 'enterprise',
      status: 'active',
      autoRenew: true
    }
  });

  console.log('✅ Admin created successfully!');
  console.log('📧 Email: admin@freelancehub.com');
  console.log('🔑 Password: Admin123!');
  process.exit();
};

createAdmin();