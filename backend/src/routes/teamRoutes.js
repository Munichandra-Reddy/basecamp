import express from 'express';
import { getWorkspaceMembers, getMemberProfile, updateMemberRole } from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/members', getWorkspaceMembers);
router.get('/members/:id', getMemberProfile);
router.put('/members/:id/role', requirePermission('manage_members'), updateMemberRole);

export default router;
