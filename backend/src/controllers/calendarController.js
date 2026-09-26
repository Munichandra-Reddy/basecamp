import db from '../config/db.js';

export async function getCalendarEvents(req, res) {
  try {
    const workspaceId = req.query.workspace_id || req.headers['x-workspace-id'] || 1;
    const events = await db.all(
      'SELECT * FROM calendar_events WHERE workspace_id = ? ORDER BY id ASC',
      [workspaceId]
    );
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createCalendarEvent(req, res) {
  try {
    const { title, event_type, start_time, end_time, description, workspace_id } = req.body;
    const wsId = workspace_id || req.headers['x-workspace-id'] || 1;

    if (!title) {
      return res.status(400).json({ error: 'Event title is required.' });
    }

    const result = await db.run(
      `INSERT INTO calendar_events (workspace_id, title, event_type, start_time, end_time, description) VALUES (?, ?, ?, ?, ?, ?)`,
      [wsId, title, event_type || 'Meeting', start_time || '2026-09-24T10:00:00', end_time || '2026-09-24T11:00:00', description || '']
    );

    const created = await db.get('SELECT * FROM calendar_events WHERE id = ?', [result.lastID]);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
