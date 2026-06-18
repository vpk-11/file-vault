const express = require('express');
const path = require('path');
const { diskStorage, MulterError } = require('multer');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const userModel = require('../models/userData');
const { isAuthenticated } = require('../middleware/auth');
const { MAX_FILE_SIZE_MB } = require('../config/env');

const router = express.Router();

const UPLOAD_DIR = path.resolve(__dirname, '..', 'uploads');

// Swap the destination function here to change storage backend (e.g. S3, R2)
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^A-Za-z0-9._-]/g, '_');
    cb(null, `${uuid()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await userModel.findById(req.session.user.id).lean();
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    return res.json({ files: user.files });
  } catch (err) {
    console.error('File list error:', err.message);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Could not retrieve files' } });
  }
});

router.post('/upload', isAuthenticated, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } });
  }

  try {
    await userModel.findByIdAndUpdate(
      req.session.user.id,
      { $push: { files: { storedName: req.file.filename, originalName: req.file.originalname } } }
    );
    return res.status(201).json({ filename: req.file.filename, originalName: req.file.originalname });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Upload failed' } });
  }
});

router.get('/:filename', isAuthenticated, async (req, res) => {
  const { filename } = req.params;

  if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
    return res.status(400).json({ error: { code: 'BAD_FILENAME', message: 'Invalid filename' } });
  }

  const resolved = path.resolve(UPLOAD_DIR, filename);
  if (!resolved.startsWith(UPLOAD_DIR + path.sep)) {
    return res.status(400).json({ error: { code: 'BAD_FILENAME', message: 'Invalid filename' } });
  }

  try {
    const user = await userModel.findOne({
      _id: req.session.user.id,
      'files.storedName': filename
    }).lean();

    if (!user) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    return res.sendFile(filename, { root: UPLOAD_DIR, dotfiles: 'deny' });
  } catch (err) {
    console.error('Download error:', err.message);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Download failed' } });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    return res.status(400).json({ error: { code: 'UPLOAD_ERROR', message: err.message } });
  }
  next(err);
});

module.exports = router;
