const jwt  = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * Middleware: wajib login (token valid)
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan. Silakan login.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek user masih ada di DB
    const [rows] = await pool.query('SELECT id, nama, username, email, role FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesi telah berakhir. Silakan login kembali.' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
};

/**
 * Middleware: hanya admin
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin.' });
  }
  next();
};

module.exports = { authenticate, adminOnly };
