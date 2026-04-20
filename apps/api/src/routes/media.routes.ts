import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth';
import { queryOne, run } from '../config/database';
import { env } from '../config/env';

const storage = multer.diskStorage({
  destination: env.UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();
router.use(authMiddleware);

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }

    const fileType = req.file.mimetype.startsWith('image/') ? 'image'
      : req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    const id = crypto.randomUUID();
    run(
      `INSERT INTO media (id, user_id, file_url, file_type, mime_type, file_size_bytes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, req.user!.userId, `/uploads/${req.file.filename}`, fileType, req.file.mimetype, req.file.size]
    );

    const media = queryOne(
      'SELECT id, file_url, file_type, mime_type, file_size_bytes, created_at FROM media WHERE id = ?',
      [id]
    );
    res.status(201).json(media);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = queryOne(
      'SELECT id FROM media WHERE id = ? AND user_id = ?',
      [req.params.id, req.user!.userId]
    );
    if (!existing) { res.status(404).json({ error: 'Media not found' }); return; }
    run('DELETE FROM media WHERE id = ? AND user_id = ?', [req.params.id, req.user!.userId]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
