// backend/src/routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  uploadAvatar,
  removeAvatar
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['freelancer', 'client']).withMessage('Invalid role')
];

// Auth routes
router.post('/register', registerValidation, register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Profile routes
router.put('/updateprofile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/avatar', protect, removeAvatar);

export default router;