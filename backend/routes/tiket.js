const express = require('express');
const { body  } = require('express-validator');
const router  = express.Router();
const { beliTiket, riwayatTiket, detailTiket, batalkanTiket } = require('../controllers/tiketController');
const { authenticate } = require('../middleware/auth');

// Semua route tiket wajib login
router.use(authenticate);

// Validasi pembelian tiket
const validasiBeli = [
  body('event_id').isInt({ min: 1 }).withMessage('Event ID tidak valid'),
  body('jumlah').isInt({ min: 1, max: 10 }).withMessage('Jumlah tiket antara 1–10'),
  body('metode_bayar').isIn(['transfer_bank', 'dompet_digital']).withMessage('Metode bayar tidak valid'),
  body('nama_pemesan').trim().notEmpty().withMessage('Nama pemesan wajib diisi'),
  body('email_pemesan').isEmail().withMessage('Email pemesan tidak valid'),
  body('telepon_pemesan').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
];

router.post('/beli',          validasiBeli, beliTiket);
router.get('/riwayat',                     riwayatTiket);
router.get('/:kode',                        detailTiket);
router.post('/:kode/batalkan',              batalkanTiket);

module.exports = router;
