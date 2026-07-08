// backend/src/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      headline, bio, location, hourlyRate, skills, 
      experienceLevel, availability, languages,
      companyName, companyWebsite, industry, companySize, companyDescription,
      github, linkedin, twitter, website, phone
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'freelancer',
      phone: phone || '',
    };

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

    if (role === 'client') {
      userData.companyName = companyName || '';
      userData.companyWebsite = companyWebsite || '';
      userData.industry = industry || '';
      userData.companySize = companySize || '';
      userData.companyDescription = companyDescription || '';
    }

    userData.socialLinks = {};
    if (github) userData.socialLinks.github = github;
    if (linkedin) userData.socialLinks.linkedin = linkedin;
    if (twitter) userData.socialLinks.twitter = twitter;
    if (website) userData.socialLinks.website = website;

    const user = await User.create(userData);
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
        phone: user.phone,
        socialLinks: user.socialLinks,
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
        phone: user.phone,
        socialLinks: user.socialLinks,
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
      'socialLinks', 'portfolio', 'phone', 'website'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.hourlyRate) {
      updateData.hourlyRate = parseFloat(req.body.hourlyRate);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// @desc    Upload avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old avatar if exists
    if (user.avatar && !user.avatar.includes('default')) {
      try {
        const oldPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      success: true,
      avatar: avatarUrl,
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

// @desc    Remove avatar
// @route   DELETE /api/auth/avatar
// @access  Private
export const removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.avatar && !user.avatar.includes('default')) {
      try {
        const oldPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    user.avatar = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar removed successfully'
    });
  } catch (error) {
    console.error('Remove avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove avatar'
    });
  }
};