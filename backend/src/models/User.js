// backend/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'admin'],
    default: 'freelancer'
  },
  avatar: {
    type: String,
    default: null
  },
  
  // Freelancer specific fields
  headline: {
    type: String,
    maxlength: [100, 'Headline cannot be more than 100 characters'],
    default: ''
  },
  bio: {
    type: String,
    maxlength: [2000, 'Bio cannot be more than 2000 characters'],
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true,
    default: ''
  },
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Intermediate', 'Expert', 'Senior'],
    default: 'Intermediate'
  },
  availability: {
    type: String,
    enum: ['Available', 'Not Available', 'Part-time'],
    default: 'Available'
  },
  languages: [{
    type: String,
    trim: true
  }],
  
  // Client specific fields
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  companyWebsite: {
    type: String,
    trim: true,
    default: ''
  },
  industry: {
    type: String,
    trim: true,
    default: ''
  },
  companySize: {
    type: String,
    enum: ['', '1-10', '11-50', '51-200', '201-500', '500+'],
    default: ''
  },
  companyDescription: {
    type: String,
    maxlength: [2000, 'Company description cannot be more than 2000 characters'],
    default: ''
  },
  
  // Social Links
  socialLinks: {
    type: Map,
    of: String,
    default: {}
  },
  
  // Portfolio items
  portfolio: [{
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    }
  }],
  
  // Contact
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Stats
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalProjects: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stripeAccountId: {
    type: String,
    default: ''
  }
  
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ location: 1 });
userSchema.index({ hourlyRate: 1 });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);