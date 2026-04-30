# 🎵 SeniLokal Backend API

Backend REST API untuk platform SeniLokal — dibangun dengan **Node.js + Express + MySQL**.

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Setup database
Buka MySQL dan jalankan:
```bash
mysql -u root -p

jalankan source C:/path/ke/folder/senilokal-backend/database.sql 
# sesuaikan path dengan letak project di pc anda
```

### 3. Konfigurasi environment
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi kamu
```

### 4. Jalankan server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

---

## 📋 Daftar Endpoint API

### 🔐 Auth
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| POST | `/api/auth/daftar` | Publik | Registrasi user baru |
| POST | `/api/auth/masuk` | Publik | Login |
| GET | `/api/auth/profil` | Login | Profil user aktif |

### 🎭 Events
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/api/events` | Publik | Semua event (dengan filter) |
| GET | `/api/events/:id` | Publik | Detail event |
| POST | `/api/events` | Admin | Tambah produk/pertunjukan |
| PUT | `/api/events/:id` | Admin | Edit produk/pertunjukan |
| DELETE | `/api/events/:id` | Admin | Hapus produk/pertunjukan |

> Filter `/api/events`: `?kategori=Karawitan&kota=Bandung&tanggal=bulan_ini`

Frontend membaca base URL API dari `public/config.js`. Default-nya `http://localhost:3000/api`, dan bisa dioverride sebelum `config.js` dimuat dengan mengisi `window.SENILOKAL_API_BASE_URL`.

### 🎫 Tiket
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| POST | `/api/tiket/beli` | Login | Beli tiket |
| GET | `/api/tiket/riwayat` | Login | Riwayat tiket user |
| GET | `/api/tiket/:kode` | Login | Detail tiket |
| POST | `/api/tiket/:kode/batalkan` | Login | Batalkan tiket |

### 📬 Kontak
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| POST | `/api/kontak` | Publik | Kirim pesan kontak |
| GET | `/api/kontak` | Admin | Semua pesan masuk |
| PATCH | `/api/kontak/:id/status` | Admin | Update status pesan |

---

## 📦 Contoh Request & Response

### Daftar (POST /api/auth/daftar)
```json
// Request Body
{
  "nama": "Budi Santoso",
  "username": "budi123",
  "email": "budi@email.com",
  "password": "rahasia123",
  "telepon": "081234567890",
  "kota": "Bandung",
  "umur": 25
}

// Response 201
{
  "success": true,
  "message": "Registrasi berhasil! Selamat bergabung di SeniLokal.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "nama": "Budi Santoso", "username": "budi123", ... }
}
```

### Beli Tiket (POST /api/tiket/beli)
```json
// Header: Authorization: Bearer <token>
// Request Body
{
  "event_id": 1,
  "jumlah": 2,
  "metode_bayar": "transfer_bank",
  "nama_pemesan": "Budi Santoso",
  "email_pemesan": "budi@email.com",
  "telepon_pemesan": "081234567890"
}

// Response 201
{
  "success": true,
  "message": "Pembelian tiket berhasil! Cek email untuk detail konfirmasi.",
  "tiket": {
    "kode_tiket": "SL-20250615-A3B2C",
    "event": { "judul": "Pagelaran Gending Gandari...", ... },
    "jumlah": 2,
    "total_harga": 150000,
    "status_bayar": "menunggu"
  }
}
```

### Kirim Kontak (POST /api/kontak)
```json
// Request Body
{
  "nama": "Sari",
  "email": "sari@email.com",
  "subjek": "Pertanyaan tentang tiket",
  "pesan": "Halo, bagaimana cara membeli tiket untuk acara bulan depan?"
}

// Response 201
{
  "success": true,
  "message": "Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera."
}
```

---

## 🔒 Autentikasi

Gunakan **Bearer Token** di header untuk endpoint yang memerlukan login:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📁 Struktur Folder

```
senilokal-backend/
├── config/
│   ├── database.js     # Koneksi MySQL
│   └── mailer.js       # Konfigurasi email & template
├── controllers/
│   ├── authController.js
│   ├── tiketController.js
│   ├── kontakController.js
│   └── eventController.js
├── middleware/
│   └── auth.js         # JWT middleware
├── routes/
│   ├── auth.js
│   ├── tiket.js
│   ├── kontak.js
│   └── events.js
├── database.sql        # Schema + data awal
├── server.js           # Entry point
├── .env.example        # Template environment
└── package.json
```
