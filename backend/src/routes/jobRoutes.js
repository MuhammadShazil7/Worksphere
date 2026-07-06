import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobsByClient
} from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, createJob);

router.route('/client/:clientId')
  .get(protect, getJobsByClient);

router.route('/:id')
  .get(getJob)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

export default router;