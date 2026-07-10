// backend/src/models/Delivery.js
import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 5000
  },
  files: [{
    name: String,
    url: String,
    size: Number,
    type: String
  }],
  status: {
    type: String,
    enum: ['submitted', 'in-review', 'approved', 'rejected', 'revision-requested'],
    default: 'submitted'
  },
  version: {
    type: Number,
    default: 1
  },
  feedback: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  previousVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  },
  reviewedAt: {
    type: Date
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Delivery', deliverySchema);