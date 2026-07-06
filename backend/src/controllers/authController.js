// backend/src/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      name, email, password, role,
      // Freelancer fields
      headline, bio, location, hourlyRate, skills, 
      experienceLevel, availability, languages,
      // Client fields
      companyName, companyWebsite, industry, companySize, companyDescription,
      // Social links
      github, linkedin, twitter, website
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Build user data based on role
    const userData = {
      name,
      email,
      password,
      role: role || 'freelancer',
    };

    // Add freelancer specific fields
    if (role === 'freelancer') {
      userData.headline = headline || '';
      userData.bio = bio || '';
      userData.location = location || '';
      userData.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : 0;
      userData.skills = skills || [];
      userData.experienceLevel = experienceLevel || 'Intermediate';
      userData.availability = availability || 'Available';
      userData.languages = languages || [];
    }

    // Add client specific fields
    if (role === 'client') {
      userData.companyName = companyName || '';
      userData.companyWebsite = companyWebsite || '';
      userData.industry = industry || '';
      userData.companySize = companySize || '';
      userData.companyDescription = companyDescription || '';
    }

    // Add social links
    userData.github = github || '';
    userData.linkedin = linkedin || '';
    userData.twitter = twitter || '';
    userData.website = website || '';

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        location: user.location,
        hourlyRate: user.hourlyRate,
        skills: user.skills,
        companyName: user.companyName,
        isVerified: user.isVerified,
        rating: user.rating,
        totalProjects: user.totalProjects,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline,
        location: user.location,
        hourlyRate: user.hourlyRate,
        skills: user.skills,
        companyName: user.companyName,
        isVerified: user.isVerified,
        rating: user.rating,
        totalProjects: user.totalProjects,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const allowedFields = [
      'name', 'headline', 'bio', 'location', 'hourlyRate', 
      'skills', 'experienceLevel', 'availability', 'languages',
      'companyName', 'companyWebsite', 'industry', 'companySize', 'companyDescription',
      'github', 'linkedin', 'twitter', 'website'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};