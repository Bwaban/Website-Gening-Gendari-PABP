require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');  


const authRoutes   = require('./routes/auth');
const tiketRoutes  = require('./routes/tiket');
const kontakRoutes = require('./routes/kontak');
const eventRoutes  = require('./routes/events');
const uploadRoutes = require('./routes/upload');

const app  = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log request (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

app.use(express.static(path.join(__dirname, 'public')));


// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth',   authRoutes);
app.use('/api/tiket',  tiketRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'SeniLokal API berjalan dengan baik 🎵', timestamp: new Date() });
});

// ==========================================
// 404 & ERROR HANDLER
// ==========================================
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log('');
  console.log('🎵 ================================');
  console.log(`🎵  SeniLokal Backend API`);
  console.log(`🎵  Running on port ${PORT}`);
  console.log(`🎵  ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log('🎵 ================================');
  console.log('');
});

module.exports = app;
