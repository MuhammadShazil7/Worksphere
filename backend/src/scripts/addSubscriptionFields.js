// backend/src/scripts/addSubscriptionFields.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();
connectDB();

const addSubscriptionFields = async () => {
  try {
    console.log('🔄 Adding subscription fields to users...');

    // Update all existing users with default subscription
    const result = await User.updateMany(
      {},
      {
        $set: {
          subscription: {
            plan: 'free',
            status: 'inactive',
            startDate: null,
            endDate: null,
            autoRenew: true
          },
          freeProposalsUsed: 0,
          freeProposalsLimit: 5,
          freeProposalsResetDate: new Date()
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

addSubscriptionFields();