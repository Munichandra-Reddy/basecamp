import express from 'express';
import { getNotifications, markAsRead, globalSearch } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.get('/search', globalSearch);

export default router;
