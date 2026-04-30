const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const {
  semuaEvent,
  detailEvent,
  tambahEvent,
  updateEvent,
  hapusEvent,
} = require('../controllers/eventController');
const { authenticate, adminOnly } = require('../middleware/auth');

const validasiEvent = [
  body('judul').trim().notEmpty().withMessage('Judul wajib diisi'),
  body('kategori').isIn(['Gending Gandari', 'Karawitan', 'Wayang', 'Tari Tradisional']).withMessage('Kategori tidak valid'),
  body('tanggal').isISO8601().withMessage('Tanggal tidak valid'),
  body('kota').trim().notEmpty().withMessage('Kota wajib diisi'),
  body('lokasi').trim().notEmpty().withMessage('Lokasi wajib diisi'),
  body('harga').isInt({ min: 0 }).withMessage('Harga tidak valid'),
  body('kuota').isInt({ min: 1 }).withMessage('Kuota tidak valid'),
  body('status').optional().isIn(['tersedia', 'terbatas', 'habis']).withMessage('Status tidak valid'),
];

router.get('/',    semuaEvent);
router.get('/:id', detailEvent);
router.post('/', authenticate, adminOnly, validasiEvent, tambahEvent);
router.put('/:id', authenticate, adminOnly, validasiEvent, updateEvent);
router.delete('/:id', authenticate, adminOnly, hapusEvent);

module.exports = router;
