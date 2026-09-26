import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export async function getWorkspaces(req, res) {
  try {
    const userId = req.user.id;
    const workspaces = await db.all(
      `SELECT w.*, wm.role as user_role,
              (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = w.id) as member_count,
              (SELECT COUNT(*) FROM projects WHERE workspace_id = w.id) as project_count
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = ?`,
      [userId]
    );
    return res.json(workspaces);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createWorkspace(req, res) {
  try {
    const { name, slug } = req.body;
    const userId = req.user.id;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Workspace name and URL slug are required.' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await db.get('SELECT id FROM workspaces WHERE slug = ?', [cleanSlug]);
    if (existing) {
      return res.status(400).json({ error: 'Workspace URL slug already taken.' });
    }

    const ws = await db.run(
      `INSERT INTO workspaces (name, slug, owner_id, subscription_plan) VALUES (?, ?, ?, 'Free')`,
      [name, cleanSlug, userId]
    );

    const wsId = ws.lastID;
    await db.run(
      `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, 'Workspace Admin')`,
      [wsId, userId]
    );

    // Create default starter tag
    await db.run(`INSERT INTO tags (workspace_id, name, color) VALUES (?, '#general', '#3B82F6')`, [wsId]);

    const createdWs = await db.get('SELECT * FROM workspaces WHERE id = ?', [wsId]);
    return res.status(201).json(createdWs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getWorkspaceById(req, res) {
  try {
    const { id } = req.params;
    const ws = await db.get('SELECT * FROM workspaces WHERE id = ?', [id]);
    if (!ws) return res.status(404).json({ error: 'Workspace not found.' });
    return res.json(ws);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateWorkspace(req, res) {
  try {
    const { id } = req.params;
    const { name, subscription_plan } = req.body;
    await db.run(
      `UPDATE workspaces SET name = COALESCE(?, name), subscription_plan = COALESCE(?, subscription_plan) WHERE id = ?`,
      [name, subscription_plan, id]
    );
    const updated = await db.get('SELECT * FROM workspaces WHERE id = ?', [id]);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function inviteMember(req, res) {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    let user = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) {
      // Create user placeholder
      const pwd = await bcrypt.hash('temp1234', 10);
      const name = email.split('@')[0];
      const newU = await db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, pwd, role || 'Member']
      );
      user = { id: newU.lastID };
    }

    const existingMem = await db.get('SELECT id FROM workspace_members WHERE workspace_id = ? AND user_id = ?', [id, user.id]);
    if (existingMem) {
      return res.status(400).json({ error: 'User is already a member of this workspace.' });
    }

    await db.run(
      `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)`,
      [id, user.id, role || 'Member']
    );

    return res.json({ message: `Invitation sent to ${email}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
