import express from 'express';
import multer from 'multer';
import { getFiles, createFolder, uploadFile, deleteFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.use(authMiddleware);

router.get('/projects/:projectId/files', getFiles);
router.post('/projects/:projectId/folders', createFolder);
router.post('/projects/:projectId/upload', upload.single('file'), requirePermission('upload_files'), uploadFile);
router.delete('/:id', deleteFile);

export default router;
