// backend/src/models/Proposal.js
import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter'],
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  proposedBudget: {
    type: Number,
    required: [true, 'Please add a proposed budget'],
    min: [1, 'Budget must be at least 1']
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Please add estimated duration'],
    enum: ['Less than 1 week', '1-4 weeks', '1-3 months', '3+ months']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  attachments: [{
    name: String,
    url: String
  }],
  clientFeedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });

export default mongoose.model('Proposal', proposalSchema);