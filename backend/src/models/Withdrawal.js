// backend/src/models/Withdrawal.js
import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['bank_transfer', 'jazzcash', 'easypaisa'],
    required: true
  },
  accountDetails: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    phoneNumber: String,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  referenceNumber: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate reference number before saving
withdrawalSchema.pre('save', function(next) {
  if (!this.referenceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referenceNumber = `WTH-${year}${month}${day}-${random}`;
  }
  next();
});

export default mongoose.model('Withdrawal', withdrawalSchema);