const express = require('express');
const { body  } = require('express-validator');
const router  = express.Router();
const { daftar, masuk, profil } = require('../controllers/authController');
const { authenticate }          = require('../middleware/auth');

// Validasi daftar
const validasiDaftar = [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username minimal 3 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh huruf, angka, dan underscore'),
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('umur').optional().isInt({ min: 1, max: 120 }).withMessage('Umur tidak valid'),
  body('telepon').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
];

// Validasi masuk
const validasiMasuk = [
  body('username').trim().notEmpty().withMessage('Username/email wajib diisi'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
];

// Routes
router.post('/daftar', validasiDaftar, daftar);
router.post('/masuk',  validasiMasuk,  masuk);
router.get('/profil',  authenticate,   profil);

module.exports = router;
