import express from 'express';
import { getDashboardStats } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard-stats', getDashboardStats);

export default router;
