const { validationResult } = require('express-validator');
const pool     = require('../config/database');
const mailer   = require('../config/mailer');

/**
 * Generate kode tiket unik: SL-YYYYMMDD-XXXXX
 */
const generateKodeTiket = () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand  = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SL-${today}-${rand}`;
};

/**
 * POST /api/tiket/beli
 * Pembelian tiket event (user login wajib)
 */
const beliTiket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { event_id, jumlah, metode_bayar, nama_pemesan, email_pemesan, telepon_pemesan, catatan } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Ambil event dengan lock agar tidak race condition
    const [events] = await conn.query(
      'SELECT * FROM events WHERE id = ? FOR UPDATE',
      [event_id]
    );

    if (!events.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Event tidak ditemukan.' });
    }

    const event = events[0];

    if (event.status === 'habis') {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Tiket sudah habis.' });
    }

    const sisaTiket = event.kuota - event.tiket_terjual;
    if (jumlah > sisaTiket) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: `Tiket tersisa hanya ${sisaTiket}. Kurangi jumlah pembelian.`,
      });
    }

    const total_harga  = event.harga * jumlah;
    const kode_tiket   = generateKodeTiket();
    const tiket_baru   = event.tiket_terjual + jumlah;
    const sisa_baru    = event.kuota - tiket_baru;
    const status_baru  = sisa_baru === 0 ? 'habis' : sisa_baru <= event.kuota * 0.1 ? 'terbatas' : 'tersedia';

    // Simpan tiket
    const [result] = await conn.query(
      `INSERT INTO tikets
         (kode_tiket, user_id, event_id, jumlah, total_harga, metode_bayar,
          nama_pemesan, email_pemesan, telepon_pemesan, catatan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [kode_tiket, req.user.id, event_id, jumlah, total_harga, metode_bayar,
       nama_pemesan, email_pemesan, telepon_pemesan || null, catatan || null]
    );

    // Update stok event
    await conn.query(
      'UPDATE events SET tiket_terjual = ?, status = ? WHERE id = ?',
      [tiket_baru, status_baru, event_id]
    );

    await conn.commit();

    // Kirim email konfirmasi (non-blocking)
    mailer.kirimKonfirmasiTiket({
      to:          email_pemesan,
      nama:        nama_pemesan,
      kode_tiket,
      judul_event: event.judul,
      tanggal:     event.tanggal,
      lokasi:      event.lokasi,
      jumlah,
      total_harga,
      metode_bayar,
    }).catch(err => console.error('Email tiket gagal:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Pembelian tiket berhasil! Cek email untuk detail konfirmasi.',
      tiket: {
        id:          result.insertId,
        kode_tiket,
        event:       { id: event.id, judul: event.judul, tanggal: event.tanggal, lokasi: event.lokasi },
        jumlah,
        total_harga,
        metode_bayar,
        status_bayar: 'menunggu',
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error beli tiket:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  } finally {
    conn.release();
  }
};

/**
 * GET /api/tiket/riwayat
 * Riwayat tiket milik user yang login
 */
const riwayatTiket = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, e.judul, e.kategori, e.tanggal, e.lokasi, e.kota, e.emoji
       FROM tikets t
       JOIN events e ON t.event_id = e.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, tikets: rows });
  } catch (err) {
    console.error('Error riwayat:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * GET /api/tiket/:kode
 * Detail tiket berdasarkan kode
 */
const detailTiket = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, e.judul, e.kategori, e.tanggal, e.lokasi, e.kota, e.emoji, e.harga
       FROM tikets t
       JOIN events e ON t.event_id = e.id
       WHERE t.kode_tiket = ? AND t.user_id = ?`,
      [req.params.kode, req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    }
    return res.json({ success: true, tiket: rows[0] });
  } catch (err) {
    console.error('Error detail tiket:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * POST /api/tiket/:kode/batalkan
 * Batalkan tiket (hanya tiket dengan status menunggu)
 */
const batalkanTiket = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT * FROM tikets WHERE kode_tiket = ? AND user_id = ? FOR UPDATE',
      [req.params.kode, req.user.id]
    );

    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    }

    const tiket = rows[0];

    if (tiket.status_bayar !== 'menunggu') {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: `Tiket dengan status "${tiket.status_bayar}" tidak bisa dibatalkan.`,
      });
    }

    // Update status tiket
    await conn.query(
      'UPDATE tikets SET status_bayar = ? WHERE id = ?',
      ['dibatalkan', tiket.id]
    );

    // Kembalikan stok event
    await conn.query(
      `UPDATE events
       SET tiket_terjual = tiket_terjual - ?,
           status = CASE
             WHEN (kuota - (tiket_terjual - ?)) = 0 THEN 'habis'
             WHEN (kuota - (tiket_terjual - ?)) <= kuota * 0.1 THEN 'terbatas'
             ELSE 'tersedia'
           END
       WHERE id = ?`,
      [tiket.jumlah, tiket.jumlah, tiket.jumlah, tiket.event_id]
    );

    await conn.commit();
    return res.json({ success: true, message: 'Tiket berhasil dibatalkan.' });
  } catch (err) {
    await conn.rollback();
    console.error('Error batalkan tiket:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  } finally {
    conn.release();
  }
};

/**
 * GET /api/tiket/admin/semua
 * List semua tiket untuk admin
 */
const semuaTiket = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, e.judul, e.kategori, e.tanggal, e.lokasi, e.kota, e.emoji
       FROM tikets t
       JOIN events e ON t.event_id = e.id
       ORDER BY t.created_at DESC`
    );
    return res.json({ success: true, tikets: rows });
  } catch (err) {
    console.error('Error semua tiket:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * PATCH /api/tiket/admin/:id/status
 * Update status bayar oleh admin (Lunas / Batalkan)
 */
const updateStatusTiket = async (req, res) => {
  const { status } = req.body; // 'lunas' atau 'dibatalkan'
  const { id } = req.params;

  if (!['lunas', 'dibatalkan'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT * FROM tikets WHERE id = ? FOR UPDATE',
      [id]
    );

    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    }

    const tiket = rows[0];

    // Jika status diubah dari 'menunggu' ke 'dibatalkan', kembalikan stok
    if (tiket.status_bayar === 'menunggu' && status === 'dibatalkan') {
      await conn.query(
        `UPDATE events
         SET tiket_terjual = tiket_terjual - ?,
             status = CASE
               WHEN (kuota - (tiket_terjual - ?)) = 0 THEN 'habis'
               WHEN (kuota - (tiket_terjual - ?)) <= kuota * 0.1 THEN 'terbatas'
               ELSE 'tersedia'
             END
         WHERE id = ?`,
        [tiket.jumlah, tiket.jumlah, tiket.jumlah, tiket.event_id]
      );
    } 
    // Jika status diubah dari 'dibatalkan' ke 'lunas' (mungkin admin salah tekan), kurangi stok lagi jika masih ada
    else if (tiket.status_bayar === 'dibatalkan' && status === 'lunas') {
      const [events] = await conn.query('SELECT kuota, tiket_terjual FROM events WHERE id = ? FOR UPDATE', [tiket.event_id]);
      const event = events[0];
      if (event.tiket_terjual + tiket.jumlah > event.kuota) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: 'Gagal mengaktifkan kembali tiket. Kuota event sudah penuh.' });
      }

      await conn.query(
        `UPDATE events
         SET tiket_terjual = tiket_terjual + ?,
             status = CASE
               WHEN (kuota - (tiket_terjual + ?)) = 0 THEN 'habis'
               WHEN (kuota - (tiket_terjual + ?)) <= kuota * 0.1 THEN 'terbatas'
               ELSE 'tersedia'
             END
         WHERE id = ?`,
        [tiket.jumlah, tiket.jumlah, tiket.jumlah, tiket.event_id]
      );
    }

    await conn.query(
      'UPDATE tikets SET status_bayar = ? WHERE id = ?',
      [status, id]
    );

    await conn.commit();
    return res.json({ success: true, message: `Status tiket berhasil diubah menjadi ${status}.` });
  } catch (err) {
    await conn.rollback();
    console.error('Error update status tiket:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  } finally {
    conn.release();
  }
};

module.exports = { beliTiket, riwayatTiket, detailTiket, batalkanTiket, semuaTiket, updateStatusTiket };
