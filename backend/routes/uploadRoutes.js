const express = require('express');
const upload = require('../middleware/uploadHandler');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Upload single file
router.post('/single', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
    fileName: req.file.filename,
  });
});

// Upload multiple files
router.post('/multiple', authMiddleware, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const filePaths = req.files.map(file => `/uploads/${file.filename}`);

  res.status(200).json({
    message: 'Files uploaded successfully',
    filePaths,
    count: req.files.length,
  });
});

module.exports = router;