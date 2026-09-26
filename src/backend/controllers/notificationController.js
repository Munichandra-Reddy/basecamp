import db from '../config/db.js';

export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await db.all(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    return res.json({ message: 'Marked as read.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function globalSearch(req, res) {
  try {
    const { query, workspace_id } = req.query;
    if (!query) return res.json({ projects: [], tasks: [], people: [], files: [] });

    const q = `%${query}%`;
    const wsId = workspace_id || 1;

    const projects = await db.all(
      'SELECT id, name, description, status FROM projects WHERE workspace_id = ? AND (name LIKE ? OR description LIKE ?) LIMIT 5',
      [wsId, q, q]
    );

    const tasks = await db.all(
      `SELECT t.id, t.title, t.priority, t.status, p.name as project_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE p.workspace_id = ? AND (t.title LIKE ? OR t.description LIKE ?) LIMIT 5`,
      [wsId, q, q]
    );

    const people = await db.all(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.role
       FROM users u
       JOIN workspace_members wm ON u.id = wm.user_id
       WHERE wm.workspace_id = ? AND (u.name LIKE ? OR u.email LIKE ?) LIMIT 5`,
      [wsId, q, q]
    );

    const files = await db.all(
      `SELECT f.id, f.name, f.file_url, f.file_size
       FROM files f
       JOIN projects p ON f.project_id = p.id
       WHERE p.workspace_id = ? AND f.name LIKE ? LIMIT 5`,
      [wsId, q]
    );

    return res.json({ projects, tasks, people, files });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
