import db from '../config/db.js';

export async function getProjects(req, res) {
  try {
    const workspaceId = req.query.workspace_id || req.headers['x-workspace-id'];
    const { status, search } = req.query;

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID required.' });
    }

    let sql = `
      SELECT p.*, u.name as owner_name, u.avatar_url as owner_avatar,
        (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'Completed') as completed_tasks,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as total_tasks
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.workspace_id = ?
    `;

    const params = [workspaceId];

    if (status && status !== 'All') {
      sql += ` AND p.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const projects = await db.all(sql, params);

    // Compute exact progress percentage dynamically if total_tasks > 0
    const calculated = projects.map(p => {
      const progress = p.total_tasks > 0 ? Math.round((p.completed_tasks / p.total_tasks) * 100) : p.progress;
      return { ...p, progress };
    });

    return res.json(calculated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = await db.get(
      `SELECT p.*, u.name as owner_name, u.avatar_url as owner_avatar
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (!project) return res.status(404).json({ error: 'Project not found.' });

    // Fetch members
    const members = await db.all(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.role, u.status
       FROM users u
       JOIN project_members pm ON u.id = pm.user_id
       WHERE pm.project_id = ?`,
      [id]
    );

    // Fetch task counts
    const taskStats = await db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status != 'Completed' THEN 1 ELSE 0 END) as remaining
       FROM tasks WHERE project_id = ?`,
      [id]
    );

    // Fetch recent activity
    const recentActivity = await db.all(
      `SELECT a.*, u.name as user_name, u.avatar_url as user_avatar
       FROM activity_logs a
       JOIN users u ON a.user_id = u.id
       WHERE a.workspace_id = ?
       ORDER BY a.created_at DESC LIMIT 5`,
      [project.workspace_id]
    );

    const progress = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : project.progress;

    return res.json({
      ...project,
      progress,
      members,
      taskStats: {
        completed: taskStats.completed || 0,
        remaining: taskStats.remaining || 0,
        total: taskStats.total || 0
      },
      recentActivity
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createProject(req, res) {
  try {
    const { workspace_id, name, description, start_date, due_date, members } = req.body;
    const owner_id = req.user?.id || 1;
    const targetWorkspaceId = workspace_id || req.headers['x-workspace-id'] || 1;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    const proj = await db.run(
      `INSERT INTO projects (workspace_id, name, description, owner_id, start_date, due_date, status, progress) VALUES (?, ?, ?, ?, ?, ?, 'Active', 0)`,
      [targetWorkspaceId, name, description || '', owner_id, start_date || '2026-09-24', due_date || '2026-10-30']
    );

    const projId = proj.lastID;

    try {
      await db.run(`INSERT INTO project_members (project_id, user_id) VALUES (?, ?)`, [projId, owner_id]);
    } catch (e) {}

    if (Array.isArray(members)) {
      for (const mId of members) {
        if (mId !== owner_id) {
          try {
            await db.run(`INSERT INTO project_members (project_id, user_id) VALUES (?, ?)`, [projId, mId]);
          } catch (e) {}
        }
      }
    }

    try {
      await db.run(
        `INSERT INTO activity_logs (workspace_id, user_id, action, target_type, target_id, details) VALUES (?, ?, 'created_project', 'project', ?, ?)`,
        [targetWorkspaceId, owner_id, projId, `${req.user?.name || 'User'} created "${name}"`]
      );
    } catch (e) {}

    const newProject = await db.get('SELECT * FROM projects WHERE id = ?', [projId]);
    return res.status(201).json(newProject || { id: projId, name, description, workspace_id: targetWorkspaceId, due_date: due_date || '2026-10-30', status: 'Active', progress: 0 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { name, description, status, due_date } = req.body;
    await db.run(
      `UPDATE projects SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        due_date = COALESCE(?, due_date)
       WHERE id = ?`,
      [name, description, status, due_date, id]
    );
    const updated = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM project_members WHERE project_id = ?', [id]);
    await db.run('DELETE FROM tasks WHERE project_id = ?', [id]);
    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    return res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
