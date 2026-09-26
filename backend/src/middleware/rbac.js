import db from '../config/db.js';

export const ROLE_PERMISSIONS = {
  'Super Admin': ['create_project', 'delete_project', 'create_task', 'delete_task', 'comment', 'upload_files', 'manage_members', 'manage_settings'],
  'Workspace Admin': ['create_project', 'delete_project', 'create_task', 'delete_task', 'comment', 'upload_files', 'manage_members', 'manage_settings'],
  'Project Manager': ['create_project', 'delete_project', 'create_task', 'delete_task', 'comment', 'upload_files', 'manage_members'],
  'Team Lead': ['create_task', 'comment', 'upload_files'],
  'Member': ['create_task', 'comment', 'upload_files'],
  'Guest': ['comment', 'upload_files_limited']
};

export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const workspaceId = req.headers['x-workspace-id'] || req.query.workspace_id || req.body.workspace_id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      let userRole = req.user?.role || 'Member';

      if (workspaceId) {
        const member = await db.get(
          `SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?`,
          [workspaceId, userId]
        );
        if (member) {
          userRole = member.role;
        }
      }

      const allowedPermissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS['Member'];
      if (!allowedPermissions.includes(permission)) {
        return res.status(403).json({ error: `Permission denied. Required permission: '${permission}' for role '${userRole}'` });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
