import db from '../config/db.js';

export async function getCheckins(req, res) {
  try {
    const { projectId } = req.params;
    const checkins = await db.all(
      `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar, u.role as user_role
       FROM checkins c
       JOIN users u ON c.user_id = u.id
       WHERE c.project_id = ?
       ORDER BY c.submitted_at DESC`,
      [projectId]
    );

    return res.json(checkins);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function submitCheckin(req, res) {
  try {
    const { projectId } = req.params;
    const { status, completed_work, next_plan, blockers } = req.body;
    const userId = req.user.id;

    if (!status) return res.status(400).json({ error: 'Project status choice required.' });

    const cRes = await db.run(
      `INSERT INTO checkins (project_id, user_id, status, completed_work, next_plan, blockers) VALUES (?, ?, ?, ?, ?, ?)`,
      [projectId, userId, status, completed_work, next_plan, blockers]
    );

    const created = await db.get(
      `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar
       FROM checkins c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [cRes.lastID]
    );

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
