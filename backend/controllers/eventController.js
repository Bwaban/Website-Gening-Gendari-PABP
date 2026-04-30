const pool = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * GET /api/events
 * Ambil semua event dengan filter opsional
 * Query params: kategori, kota, tanggal (bulan_ini / bulan_depan / 3_bulan)
 */
const semuaEvent = async (req, res) => {
  try {
    const { kategori, kota, tanggal } = req.query;

    let query  = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (kategori && kategori !== 'Semua Kategori') {
      query += ' AND kategori = ?';
      params.push(kategori);
    }

    if (kota && kota !== 'Semua Kota') {
      query += ' AND kota = ?';
      params.push(kota);
    }

    if (tanggal) {
      const now = new Date();
      if (tanggal === 'bulan_ini') {
        const awal = new Date(now.getFullYear(), now.getMonth(), 1);
        const akhir = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        query += ' AND tanggal BETWEEN ? AND ?';
        params.push(awal, akhir);
      } else if (tanggal === 'bulan_depan') {
        const awal = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const akhir = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        query += ' AND tanggal BETWEEN ? AND ?';
        params.push(awal, akhir);
      } else if (tanggal === '3_bulan') {
        const tiga_bulan = new Date();
        tiga_bulan.setMonth(tiga_bulan.getMonth() + 3);
        query += ' AND tanggal BETWEEN NOW() AND ?';
        params.push(tiga_bulan);
      }
    }

    query += ' ORDER BY tanggal ASC';

    const [rows] = await pool.query(query, params);
    return res.json({ success: true, events: rows });
  } catch (err) {
    console.error('Error ambil events:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * GET /api/events/:id
 * Detail satu event
 */
const detailEvent = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Event tidak ditemukan.' });
    }
    return res.json({ success: true, event: rows[0] });
  } catch (err) {
    console.error('Error detail event:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const eventPayload = (body) => ({
  judul: body.judul,
  kategori: body.kategori,
  deskripsi: body.deskripsi || null,
  tanggal: String(body.tanggal).replace('T', ' '),
  kota: body.kota,
  lokasi: body.lokasi,
  harga: Number(body.harga),
  kuota: Number(body.kuota),
  tiket_terjual: Number(body.tiket_terjual || 0),
  status: body.status || 'tersedia',
  gradient_style: body.gradient_style || null,
  emoji: body.emoji || null,
});

/**
 * POST /api/events
 * Tambah event/produk pertunjukan (admin)
 */
const tambahEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const data = eventPayload(req.body);

  try {
    const [result] = await pool.query(
      `INSERT INTO events
       (judul, kategori, deskripsi, tanggal, kota, lokasi, harga, kuota, tiket_terjual, status, gradient_style, emoji)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.judul,
        data.kategori,
        data.deskripsi,
        data.tanggal,
        data.kota,
        data.lokasi,
        data.harga,
        data.kuota,
        data.tiket_terjual,
        data.status,
        data.gradient_style,
        data.emoji,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Produk pertunjukan berhasil ditambahkan.', event: rows[0] });
  } catch (err) {
    console.error('Error tambah event:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * PUT /api/events/:id
 * Edit event/produk pertunjukan (admin)
 */
const updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const data = eventPayload(req.body);

  try {
    const [result] = await pool.query(
      `UPDATE events SET
       judul = ?, kategori = ?, deskripsi = ?, tanggal = ?, kota = ?, lokasi = ?,
       harga = ?, kuota = ?, tiket_terjual = ?, status = ?, gradient_style = ?, emoji = ?
       WHERE id = ?`,
      [
        data.judul,
        data.kategori,
        data.deskripsi,
        data.tanggal,
        data.kota,
        data.lokasi,
        data.harga,
        data.kuota,
        data.tiket_terjual,
        data.status,
        data.gradient_style,
        data.emoji,
        req.params.id,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Produk pertunjukan tidak ditemukan.' });
    }

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Produk pertunjukan berhasil diperbarui.', event: rows[0] });
  } catch (err) {
    console.error('Error update event:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * DELETE /api/events/:id
 * Hapus event/produk pertunjukan (admin)
 */
const hapusEvent = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Produk pertunjukan tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Produk pertunjukan berhasil dihapus.' });
  } catch (err) {
    console.error('Error hapus event:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { semuaEvent, detailEvent, tambahEvent, updateEvent, hapusEvent };
