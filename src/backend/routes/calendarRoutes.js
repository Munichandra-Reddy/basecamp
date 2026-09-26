import express from 'express';
import { getCalendarEvents, createCalendarEvent } from '../controllers/calendarController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/events', getCalendarEvents);
router.post('/events', createCalendarEvent);

export default router;
