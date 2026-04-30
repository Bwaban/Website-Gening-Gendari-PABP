const { validationResult } = require('express-validator');
const pool   = require('../config/database');
const mailer = require('../config/mailer');

/**
 * POST /api/kontak
 * Kirim pesan kontak (publik, tidak perlu login)
 */
const kirimPesan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { nama, email, subjek, pesan } = req.body;

  try {
    // Simpan ke DB
    await pool.query(
      'INSERT INTO pesan_kontak (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)',
      [nama, email, subjek, pesan]
    );

    // Kirim notifikasi ke admin + auto-reply ke pengirim (non-blocking)
    mailer.kirimNotifikasiKontak({ nama, email, subjek, pesan })
      .catch(err => console.error('Email notif kontak gagal:', err.message));

    mailer.kirimAutoReplyKontak({ nama, email })
      .catch(err => console.error('Email auto-reply gagal:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.',
    });
  } catch (err) {
    console.error('Error kirim pesan:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * GET /api/kontak  (admin only)
 * Ambil semua pesan kontak
 */
const semuaPesan = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pesan_kontak ORDER BY created_at DESC'
    );
    return res.json({ success: true, pesan: rows });
  } catch (err) {
    console.error('Error ambil pesan:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * PATCH /api/kontak/:id/status  (admin only)
 * Update status pesan kontak
 */
const updateStatus = async (req, res) => {
  const { status } = req.body;
  const validStatus = ['baru', 'dibaca', 'dibalas'];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE pesan_kontak SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Status pesan diperbarui.' });
  } catch (err) {
    console.error('Error update status:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { kirimPesan, semuaPesan, updateStatus };
