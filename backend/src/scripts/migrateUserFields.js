// backend/src/scripts/migrateUserFields.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();
connectDB();

const migrateUserFields = async () => {
  try {
    console.log('🔄 Starting user field migration...');

    // Update all existing users with default values for new fields
    const result = await User.updateMany(
      {},
      {
        $set: {
          // Freelancer fields
          headline: '',
          bio: '',
          experienceLevel: 'Intermediate',
          availability: 'Available',
          languages: [],
          // Client fields
          companyName: '',
          companyWebsite: '',
          industry: '',
          companySize: '',
          companyDescription: '',
          // Social links
          github: '',
          linkedin: '',
          twitter: '',
          website: '',
          // Portfolio
          portfolio: [],
          // Stripe
          stripeAccountId: '',
        }
      }
    );

    console.log(`✅ Migration complete! Updated ${result.modifiedCount} users`);
    console.log(`📊 Total users: ${result.matchedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateUserFields();