import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Other']
  },
  skills: [{
    type: String,
    required: true
  }],
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [1, 'Budget must be at least 1']
  },
  duration: {
    type: String,
    enum: ['Less than 1 week', '1-4 weeks', '1-3 months', '3+ months'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Intermediate', 'Expert'],
    required: true
  },
  projectType: {
    type: String,
    enum: ['Fixed Price', 'Hourly'],
    default: 'Fixed Price'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  attachments: [{
    name: String,
    url: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);