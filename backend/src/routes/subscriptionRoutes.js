// backend/src/routes/subscriptionRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCurrentSubscription,
  subscribe,
  confirmSubscription,
  cancelSubscription,
  getPlans,
  canPropose,
  trackProposal
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.use(protect);

router.get('/current', getCurrentSubscription);
router.post('/subscribe', subscribe);
router.post('/confirm', confirmSubscription);
router.post('/cancel', cancelSubscription);
router.get('/can-propose', canPropose);
router.post('/track-proposal', trackProposal);

export default router;