// backend/src/routes/paymentRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Payment management
router.post('/create', createPayment);
router.post('/confirm/:paymentId', confirmPayment);

// Payment history
router.get('/history', getPaymentHistory);
router.get('/:id', getPayment);

export default router;