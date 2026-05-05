const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

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

module.exports = router;
