// backend/src/routes/jobRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobsByClient,
  getJobStats,
  searchJobs
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getJobs);

router.route('/search')
  .get(searchJobs);

router.route('/:id')
  .get(getJob);

// Protected routes
router.route('/')
  .post(protect, createJob);

router.route('/client/:clientId')
  .get(protect, getJobsByClient);

router.route('/stats/client')
  .get(protect, getJobStats);

router.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);

export default router;