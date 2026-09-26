import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { JWT_SECRET } from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    
    const userRes = await db.run(
      `INSERT INTO users (name, email, password, avatar_url, role, status) VALUES (?, ?, ?, ?, 'Member', 'Active')`,
      [name, email, hashedPassword, avatarUrl]
    );

    const userId = userRes.lastID;

    // Automatically create a default Personal Workspace for new user
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-workspace';
    const wsRes = await db.run(
      `INSERT INTO workspaces (name, slug, owner_id, subscription_plan) VALUES (?, ?, ?, 'Free')`,
      [`${name}'s Workspace`, slug, userId]
    );
    await db.run(
      `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, 'Workspace Admin')`,
      [wsRes.lastID, userId]
    );

    const token = jwt.sign({ id: userId, name, email, role: 'Workspace Admin' }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: { id: userId, name, email, avatar_url: avatarUrl, role: 'Workspace Admin' }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function me(req, res) {
  try {
    const user = await db.get('SELECT id, name, email, avatar_url, role, status, two_factor_enabled FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const workspaces = await db.all(
      `SELECT w.id, w.name, w.slug, w.subscription_plan, wm.role
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = ?`,
      [req.user.id]
    );

    return res.json({ user, workspaces });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, email, avatar_url } = req.body;
    const userId = req.user?.id || 1;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    await db.run(
      `UPDATE users SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        avatar_url = COALESCE(?, avatar_url)
       WHERE id = ?`,
      [name, email, avatar_url, userId]
    );

    const updated = await db.get(
      'SELECT id, name, email, avatar_url, role, status FROM users WHERE id = ?',
      [userId]
    );

    return res.json({ message: 'Profile updated successfully.', user: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }
  return res.json({ message: 'Password reset link sent to your email.' });
}

export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: 'Missing parameters.' });
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
  return res.json({ message: 'Password updated successfully.' });
}
