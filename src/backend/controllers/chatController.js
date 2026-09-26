import db from '../config/db.js';

export async function getProjectMessages(req, res) {
  try {
    const { projectId } = req.params;
    const messages = await db.all(
      `SELECT m.*, u.name as user_name, u.avatar_url as user_avatar, u.role as user_role
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.project_id = ?
       ORDER BY m.created_at ASC`,
      [projectId]
    );

    for (const msg of messages) {
      const reactions = await db.all(
        `SELECT mr.emoji, u.name as user_name, mr.user_id
         FROM message_reactions mr
         JOIN users u ON mr.user_id = u.id
         WHERE mr.message_id = ?`,
        [msg.id]
      );
      msg.reactions = reactions;
    }

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const { projectId } = req.params;
    const { content, attachment_url, reply_to_id } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ error: 'Message content required.' });

    const msgRes = await db.run(
      `INSERT INTO messages (project_id, user_id, content, attachment_url, reply_to_id) VALUES (?, ?, ?, ?, ?)`,
      [projectId, userId, content, attachment_url || null, reply_to_id || null]
    );

    const created = await db.get(
      `SELECT m.*, u.name as user_name, u.avatar_url as user_avatar, u.role as user_role
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = ?`,
      [msgRes.lastID]
    );
    created.reactions = [];

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function addReaction(req, res) {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    await db.run(
      `INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)`,
      [messageId, userId, emoji]
    );

    return res.json({ message: 'Reaction added.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
