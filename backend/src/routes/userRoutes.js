// backend/src/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUsers,
  getUserById,
  updateUser,
  getFreelancerStats
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getUsers);

router.route('/stats/freelancers')
  .get(getFreelancerStats);

router.route('/:id')
  .get(getUserById);

// Protected routes
router.route('/:id')
  .put(protect, updateUser);

export default router;