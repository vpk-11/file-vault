import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import multer, { diskStorage, MulterError } from 'multer';
import { v4 as uuid } from 'uuid';
import userModel from '../models/userData';
import { isAuthenticated } from '../middleware/auth';
import { MAX_FILE_SIZE_MB, UPLOAD_DIR } from '../config/env';

const router = Router();

// Swap the destination function here to change storage backend (e.g. S3, R2)
const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^A-Za-z0-9._-]/g, '_');
    cb(null, `${uuid()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }
});

router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.session.user!.id).lean();
    if (!user) {
      res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
      return;
    }
    res.json({ files: user.files });
  } catch (err) {
    console.error('File list error:', (err as Error).message);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Could not retrieve files' } });
  }
});

router.post('/upload', isAuthenticated, upload.single('avatar'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } });
    return;
  }

  try {
    await userModel.findByIdAndUpdate(
      req.session.user!.id,
      { $push: { files: { storedName: req.file.filename, originalName: req.file.originalname } } }
    );
    res.status(201).json({ filename: req.file.filename, originalName: req.file.originalname });
  } catch (err) {
    console.error('Upload error:', (err as Error).message);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Upload failed' } });
  }
});

router.get('/:filename', isAuthenticated, async (req: Request, res: Response) => {
  const filename = req.params['filename'] as string;

  if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
    res.status(400).json({ error: { code: 'BAD_FILENAME', message: 'Invalid filename' } });
    return;
  }

  const resolved = path.resolve(UPLOAD_DIR, filename);
  if (!resolved.startsWith(UPLOAD_DIR + path.sep)) {
    res.status(400).json({ error: { code: 'BAD_FILENAME', message: 'Invalid filename' } });
    return;
  }

  try {
    const user = await userModel.findOne({
      _id: req.session.user!.id,
      'files.storedName': filename
    }).lean();

    if (!user) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
      return;
    }

    res.sendFile(filename, { root: UPLOAD_DIR, dotfiles: 'deny' });
  } catch (err) {
    console.error('Download error:', (err as Error).message);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Download failed' } });
  }
});

router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    res.status(400).json({ error: { code: 'UPLOAD_ERROR', message: err.message } });
    return;
  }
  next(err);
});

export default router;
