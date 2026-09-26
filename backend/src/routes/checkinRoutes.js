import express from 'express';
import { getCheckins, submitCheckin } from '../controllers/checkinController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/projects/:projectId/checkins', getCheckins);
router.post('/projects/:projectId/checkins', submitCheckin);

export default router;
