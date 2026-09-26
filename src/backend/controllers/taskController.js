import db from '../config/db.js';

export async function getTasks(req, res) {
  try {
    const workspaceId = req.query.workspace_id || req.headers['x-workspace-id'] || 1;
    const { project_id, status, priority, assignee_id, search } = req.query;

    let sql = `
      SELECT t.*, p.name as project_name, u.name as assignee_name, u.avatar_url as assignee_avatar,
        (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id) as subtask_count,
        (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND is_completed = 1) as subtasks_completed,
        (SELECT COUNT(*) FROM task_comments WHERE task_id = t.id) as comment_count,
        (SELECT COUNT(*) FROM task_attachments WHERE task_id = t.id) as attachment_count
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE p.workspace_id = ?
    `;

    const params = [workspaceId];

    if (project_id) {
      sql += ` AND t.project_id = ?`;
      params.push(project_id);
    }
    if (status && status !== 'All') {
      sql += ` AND t.status = ?`;
      params.push(status);
    }
    if (priority && priority !== 'All') {
      sql += ` AND t.priority = ?`;
      params.push(priority);
    }
    if (assignee_id) {
      sql += ` AND t.assignee_id = ?`;
      params.push(assignee_id);
    }
    if (search) {
      sql += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY t.created_at DESC`;

    const tasks = await db.all(sql, params);
    const formatted = tasks.map(t => ({
      ...t,
      project: t.project_name || 'E-Commerce Website',
      brand_logo: (t.project_name || 'E')[0].toUpperCase(),
      assignee_avatar: t.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }));
    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await db.get(
      `SELECT t.*, p.name as project_name, u.name as assignee_name, u.avatar_url as assignee_avatar, u.role as assignee_role
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = ?`,
      [id]
    );

    if (!task) return res.status(404).json({ error: 'Task not found.' });

    // Fetch Subtasks
    const subtasks = await db.all('SELECT * FROM subtasks WHERE task_id = ? ORDER BY id ASC', [id]);

    // Fetch Comments
    const comments = await db.all(
      `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar
       FROM task_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.task_id = ? ORDER BY c.created_at ASC`,
      [id]
    );

    // Fetch Attachments
    const attachments = await db.all(
      `SELECT a.*, u.name as uploader_name
       FROM task_attachments a
       JOIN users u ON a.uploaded_by = u.id
       WHERE a.task_id = ?`,
      [id]
    );

    // Fetch Tags
    const tags = await db.all(
      `SELECT tg.* FROM tags tg
       JOIN task_tags tt ON tg.id = tt.tag_id
       WHERE tt.task_id = ?`,
      [id]
    );

    return res.json({
      ...task,
      subtasks,
      comments,
      attachments,
      tags
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createTask(req, res) {
  try {
    const { project_id, title, description, assignee_id, start_date, due_date, priority, status, estimated_hours } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const targetProjectId = project_id || 1;

    const resTask = await db.run(
      `INSERT INTO tasks (project_id, title, description, assignee_id, start_date, due_date, priority, status, estimated_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [targetProjectId, title, description || '', assignee_id || 1, start_date || '2026-09-23', due_date || '2026-09-28', priority || 'Medium', status || 'To Do', estimated_hours || 10]
    );

    const taskId = resTask.lastID;

    // Log Activity
    const proj = await db.get('SELECT workspace_id, name FROM projects WHERE id = ?', [targetProjectId]);
    if (proj) {
      await db.run(
        `INSERT INTO activity_logs (workspace_id, user_id, action, target_type, target_id, details) VALUES (?, ?, 'created_task', 'task', ?, ?)`,
        [proj.workspace_id, req.user ? req.user.id : 1, taskId, `${req.user ? req.user.name : 'User'} created task "${title}"`]
      );
    }

    const newTask = await db.get(
      `SELECT t.*, p.name as project_name, u.name as assignee_name, u.avatar_url as assignee_avatar
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = ?`,
      [taskId]
    );

    const formattedTask = {
      ...newTask,
      project: newTask?.project_name || 'E-Commerce Website',
      brand_logo: (newTask?.project_name || 'E')[0].toUpperCase(),
      subtask_count: 0,
      subtasks_completed: 0,
      assignee_avatar: newTask?.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };

    return res.status(201).json(formattedTask);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, assignee_id, due_date, priority, status, estimated_hours } = req.body;

    await db.run(
      `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        assignee_id = COALESCE(?, assignee_id),
        due_date = COALESCE(?, due_date),
        priority = COALESCE(?, priority),
        status = COALESCE(?, status),
        estimated_hours = COALESCE(?, estimated_hours)
       WHERE id = ?`,
      [title, description, assignee_id, due_date, priority, status, estimated_hours, id]
    );

    const updated = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function addSubtask(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Subtask title is required.' });

    const sub = await db.run(`INSERT INTO subtasks (task_id, title, is_completed) VALUES (?, ?, 0)`, [id, title]);
    const created = await db.get('SELECT * FROM subtasks WHERE id = ?', [sub.lastID]);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function toggleSubtask(req, res) {
  try {
    const { subtaskId } = req.params;
    const subtask = await db.get('SELECT * FROM subtasks WHERE id = ?', [subtaskId]);
    if (!subtask) return res.status(404).json({ error: 'Subtask not found.' });

    const newStatus = subtask.is_completed ? 0 : 1;
    await db.run('UPDATE subtasks SET is_completed = ? WHERE id = ?', [newStatus, subtaskId]);
    return res.json({ id: subtaskId, is_completed: newStatus });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ error: 'Comment content required.' });

    const com = await db.run(`INSERT INTO task_comments (task_id, user_id, content) VALUES (?, ?, ?)`, [id, userId, content]);
    const created = await db.get(
      `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar
       FROM task_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [com.lastID]
    );

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function toggleTimer(req, res) {
  try {
    const { id } = req.params;
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    const isRunning = task.is_timer_running ? 0 : 1;
    let trackedSeconds = task.tracked_seconds;

    if (isRunning) {
      await db.run(
        `INSERT INTO time_entries (task_id, user_id, start_time) VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [id, req.user.id]
      );
    } else {
      trackedSeconds += 1800;
    }

    await db.run(
      `UPDATE tasks SET is_timer_running = ?, tracked_seconds = ? WHERE id = ?`,
      [isRunning, trackedSeconds, id]
    );

    return res.json({ is_timer_running: isRunning, tracked_seconds: trackedSeconds });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
