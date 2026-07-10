// backend/src/scripts/createAdminWithDebug.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const createAdminWithDebug = async () => {
  try {
    await connectDB();

    // Delete existing admin
    await User.deleteOne({ email: 'admin@freelancehub.com' });
    console.log('✅ Deleted existing admin');

    // ✅ IMPORTANT: Let the pre('save') hook handle hashing
    // Just set the plain password, the hook will hash it
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@freelancehub.com',
      password: 'Admin123!',  // Plain password - hook will hash it
      role: 'admin',
      isVerified: true,
      isActive: true,
      subscription: {
        plan: 'enterprise',
        status: 'active',
        autoRenew: true
      }
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin._id);

    // ✅ Verify password matching works
    const isMatch = await admin.matchPassword('Admin123!');
    console.log('🔐 Password verification:', isMatch ? '✅ PASSED!' : '❌ Failed');

    if (isMatch) {
      console.log('✅ Admin login should work now!');
      console.log('🔑 Email: admin@freelancehub.com');
      console.log('🔑 Password: Admin123!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

createAdminWithDebug();