import express from 'express';
import { getWorkspaces, createWorkspace, getWorkspaceById, updateWorkspace, inviteMember } from '../controllers/workspaceController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.get('/:id', getWorkspaceById);
router.put('/:id', requirePermission('manage_settings'), updateWorkspace);
router.post('/:id/invite', requirePermission('manage_members'), inviteMember);

export default router;
