// backend/src/routes/withdrawalRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  requestWithdrawal,
  getWithdrawalHistory,
  getAvailableBalance,
  cancelWithdrawal,
  processWithdrawal,
  completeWithdrawal
} from '../controllers/withdrawalController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Freelancer routes
router.post('/request', requestWithdrawal);
router.get('/history', getWithdrawalHistory);
router.get('/balance', getAvailableBalance);
router.put('/:id/cancel', cancelWithdrawal);

// Admin routes
router.put('/:id/process', processWithdrawal);
router.put('/:id/complete', completeWithdrawal);

export default router;