const express = require('express');
const { body  } = require('express-validator');
const router  = express.Router();
const { kirimPesan, semuaPesan, updateStatus } = require('../controllers/kontakController');
const { authenticate, adminOnly }              = require('../middleware/auth');

const validasiKontak = [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('subjek').trim().isLength({ min: 3 }).withMessage('Subjek minimal 3 karakter'),
  body('pesan').trim().isLength({ min: 10 }).withMessage('Pesan minimal 10 karakter'),
];

router.post('/',          validasiKontak,              kirimPesan);
router.get('/',           authenticate, adminOnly,     semuaPesan);
router.patch('/:id/status', authenticate, adminOnly,   updateStatus);

module.exports = router;
