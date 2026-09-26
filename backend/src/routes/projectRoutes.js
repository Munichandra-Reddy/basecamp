import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', requirePermission('create_project'), createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', requirePermission('delete_project'), deleteProject);

export default router;
