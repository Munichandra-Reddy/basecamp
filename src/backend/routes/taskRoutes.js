import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  addSubtask,
  toggleSubtask,
  addComment,
  toggleTimer
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', requirePermission('create_task'), createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.post('/:id/subtasks', addSubtask);
router.put('/subtasks/:subtaskId/toggle', toggleSubtask);
router.post('/:id/comments', requirePermission('comment'), addComment);
router.post('/:id/timer', toggleTimer);

export default router;
