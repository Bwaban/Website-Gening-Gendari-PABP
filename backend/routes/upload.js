const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = require('../middleware/upload');

// Storage for payment proof uploads
const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'bukti-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const proofUpload = multer({
  storage: proofStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Hanya file gambar (.jpg, .jpeg, .png, .webp) yang diperbolehkan!'));
  }
});

// POST /api/upload/event-image
router.post('/event-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
  }

  const imageUrl = `/images/events/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Gambar berhasil diunggah.',
    imageUrl: imageUrl
  });
});

// POST /api/upload/bukti-bayar
router.post('/bukti-bayar', proofUpload.single('bukti'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
  }

  const imageUrl = `/images/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Bukti pembayaran berhasil diunggah.',
    imageUrl: imageUrl
  });
});

module.exports = router;
