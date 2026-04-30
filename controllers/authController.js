const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool   = require('../config/database');

/**
 * POST /api/auth/daftar
 * Registrasi user baru
 */
const daftar = async (req, res) => {
  // Validasi input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { nama, username, email, password, telepon, kota, umur } = req.body;

  try {
    // Cek duplikat username / email
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Username atau email sudah terdaftar.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Simpan ke DB
    const [result] = await pool.query(
      `INSERT INTO users (nama, username, email, password, telepon, kota, umur)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, username, email, hashedPassword, telepon || null, kota || null, umur || null]
    );

    // Buat token
    const token = jwt.sign(
      { id: result.insertId, username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Selamat bergabung di SeniLokal.',
      token,
      user: { id: result.insertId, nama, username, email, role: 'user' },
    });
  } catch (err) {
    console.error('Error daftar:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * POST /api/auth/masuk
 * Login user
 */
const masuk = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Cari user (bisa pakai username atau email)
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Username/email atau password salah.' });
    }

    const user = rows[0];

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Username/email atau password salah.' });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      message: `Selamat datang kembali, ${user.nama}!`,
      token,
      user: {
        id:       user.id,
        nama:     user.nama,
        username: user.username,
        email:    user.email,
        kota:     user.kota,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error('Error masuk:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * GET /api/auth/profil
 * Ambil data profil user yang sedang login
 */
const profil = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama, username, email, telepon, kota, umur, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }
    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('Error profil:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { daftar, masuk, profil };
