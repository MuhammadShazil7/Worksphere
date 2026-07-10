// backend/src/routes/deliveryRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  submitDelivery,
  getDeliveries,
  getDelivery,
  reviewDelivery,
  getDeliveryHistory
} from '../controllers/deliveryController.js';

const router = express.Router();

router.use(protect);

router.post('/', submitDelivery);
router.get('/project/:projectId', getDeliveries);
router.get('/:id', getDelivery);
router.put('/:id/review', reviewDelivery);
router.get('/history/freelancer', getDeliveryHistory);

export default router;