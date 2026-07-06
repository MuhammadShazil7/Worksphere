// backend/src/controllers/userController.js
import User from '../models/User.js';

// @desc    Get all users (with filters)
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
  try {
    const { role, search, skills, minRating } = req.query;
    
    const filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (skills) {
      filter.skills = { $in: skills.split(',') };
    }
    
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ rating: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    const allowedFields = [
      'name', 'headline', 'bio', 'location', 'hourlyRate', 
      'skills', 'experienceLevel', 'availability', 'languages',
      'companyName', 'companyWebsite', 'industry', 'companySize', 'companyDescription',
      'github', 'linkedin', 'twitter', 'website', 'avatar'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get freelancer stats
// @route   GET /api/users/stats/freelancers
// @access  Public
export const getFreelancerStats = async (req, res) => {
  try {
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const avgRating = await User.aggregate([
      { $match: { role: 'freelancer' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const topFreelancers = await User.find({ role: 'freelancer' })
      .select('name headline rating totalProjects avatar')
      .sort({ rating: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      stats: {
        totalFreelancers,
        avgRating: avgRating[0]?.avgRating || 0,
        topFreelancers
      }
    });
  } catch (error) {
    console.error('Get freelancer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};