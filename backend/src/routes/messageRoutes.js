// backend/src/routes/messageRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead
} from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(sendMessage);

router.route('/conversations')
  .get(getConversations);

router.route('/:userId')
  .get(getMessages);

router.route('/read/:userId')
  .put(markAsRead);

export default router;