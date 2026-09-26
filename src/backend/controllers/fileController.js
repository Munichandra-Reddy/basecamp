import db from '../config/db.js';

export async function getFiles(req, res) {
  try {
    const { projectId } = req.params;
    const folders = await db.all('SELECT * FROM folders WHERE project_id = ? ORDER BY name ASC', [projectId]);
    const files = await db.all(
      `SELECT f.*, u.name as uploader_name, u.avatar_url as uploader_avatar
       FROM files f
       JOIN users u ON f.uploaded_by = u.id
       WHERE f.project_id = ?
       ORDER BY f.created_at DESC`,
      [projectId]
    );

    return res.json({ folders, files });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createFolder(req, res) {
  try {
    const { projectId } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Folder name is required.' });

    const fRes = await db.run('INSERT INTO folders (project_id, name) VALUES (?, ?)', [projectId, name]);
    const created = await db.get('SELECT * FROM folders WHERE id = ?', [fRes.lastID]);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function uploadFile(req, res) {
  try {
    const { projectId } = req.params;
    const { folder_id, name, file_url, file_size } = req.body;
    const userId = req.user.id;

    let finalName = name || (req.file ? req.file.originalname : 'document.pdf');
    let finalUrl = file_url || (req.file ? `/uploads/${req.file.filename}` : 'https://example.com/document.pdf');
    let finalSize = file_size || (req.file ? req.file.size : 102400);

    const resFile = await db.run(
      `INSERT INTO files (project_id, folder_id, name, file_url, file_size, uploaded_by, version) VALUES (?, ?, ?, ?, ?, ?, '1.0')`,
      [projectId, folder_id || null, finalName, finalUrl, finalSize, userId]
    );

    const created = await db.get(
      `SELECT f.*, u.name as uploader_name
       FROM files f
       JOIN users u ON f.uploaded_by = u.id
       WHERE f.id = ?`,
      [resFile.lastID]
    );

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteFile(req, res) {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM files WHERE id = ?', [id]);
    return res.json({ message: 'File deleted.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
