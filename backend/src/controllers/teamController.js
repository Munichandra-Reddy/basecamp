import db from '../config/db.js';

export async function getWorkspaceMembers(req, res) {
  try {
    const workspaceId = req.query.workspace_id || req.headers['x-workspace-id'];
    if (!workspaceId) return res.status(400).json({ error: 'Workspace ID required.' });

    const members = await db.all(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.status, u.created_at, wm.role as workspace_role,
        (SELECT COUNT(*) FROM tasks WHERE assignee_id = u.id) as assigned_tasks_count,
        (SELECT COUNT(*) FROM tasks WHERE assignee_id = u.id AND status = 'Completed') as completed_tasks_count
       FROM users u
       JOIN workspace_members wm ON u.id = wm.user_id
       WHERE wm.workspace_id = ?`,
      [workspaceId]
    );

    return res.json(members);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getMemberProfile(req, res) {
  try {
    const { id } = req.params;
    const member = await db.get('SELECT id, name, email, avatar_url, role, status, created_at FROM users WHERE id = ?', [id]);
    if (!member) return res.status(404).json({ error: 'Member not found.' });

    const tasks = await db.all(
      `SELECT t.*, p.name as project_name FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.assignee_id = ?`,
      [id]
    );

    const projects = await db.all(
      `SELECT p.* FROM projects p JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = ?`,
      [id]
    );

    return res.json({ ...member, tasks, projects });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateMemberRole(req, res) {
  try {
    const { id } = req.params;
    const { workspace_id, role } = req.body;
    await db.run('UPDATE workspace_members SET role = ? WHERE workspace_id = ? AND user_id = ?', [role, workspace_id, id]);
    return res.json({ message: 'Role updated successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
