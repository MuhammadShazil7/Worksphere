// backend/src/routes/proposalRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createProposal,
  getProposalsByJob,
  getMyProposals,
  updateProposalStatus,
  withdrawProposal,
  getProposal
} from '../controllers/proposalController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .post(createProposal);

router.route('/my-proposals')
  .get(getMyProposals);

router.route('/job/:jobId')
  .get(getProposalsByJob);

router.route('/:id')
  .get(getProposal);

router.route('/:id/status')
  .put(updateProposalStatus);

router.route('/:id/withdraw')
  .put(withdrawProposal);

export default router;