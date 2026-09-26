import express from 'express';
import { getProjectMessages, sendMessage, addReaction } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/projects/:projectId/messages', getProjectMessages);
router.post('/projects/:projectId/messages', sendMessage);
router.post('/messages/:messageId/reactions', addReaction);

export default router;
