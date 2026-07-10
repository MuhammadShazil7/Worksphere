// backend/src/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  platformFee: {
    type: Number,
    default: 0
  },
  freelancerAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['jazzcash', 'easypaisa', 'bank_transfer', 'manual'],
    default: 'manual'
  },
  referenceNumber: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  paidAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  // Freelancer confirmation
  confirmedByFreelancer: {
    type: Boolean,
    default: false
  },
  confirmedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate invoice number
paymentSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.invoiceNumber = `INV-${year}${month}${day}-${random}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);