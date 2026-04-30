# 🧠 PROJECT CONTEXT

## 1. Informasi Umum

- **Nama project:** `SeniLokal`
- **Nama package Node.js:** `senilokal-backend`
- **Deskripsi project:** aplikasi web bertema seni budaya Indonesia, dengan fokus utama pada promosi dan pengelolaan pertunjukan tradisional seperti Gending Gandari, Karawitan, Wayang, dan Tari Tradisional. Project ini terdiri dari backend REST API berbasis Express dan frontend statis berbasis HTML/CSS/JavaScript vanilla.
- **Domain project:** ticketing/event listing untuk pertunjukan seni budaya lokal.
- **Tujuan utama:** memudahkan pengguna menemukan pertunjukan seni, mendaftar akun, login, mengirim pesan kontak, dan bagi admin mengelola data pertunjukan. Backend juga mendukung pembelian tiket dan riwayat tiket.
- **Target user:**
  - Pengunjung umum yang ingin melihat daftar pertunjukan.
  - User terdaftar yang ingin membuat akun dan login.
  - Admin yang mengelola data pertunjukan.
  - Secara konseptual ada user pembeli tiket, tetapi alur pembelian tiket belum diekspos penuh di UI frontend.
- **Fitur utama:**
  - **Katalog pertunjukan dengan filter.** Pengguna dapat melihat daftar event dari database dan memfilter berdasarkan kategori, kota, dan rentang tanggal.
  - **Autentikasi user dengan JWT.** User bisa registrasi dan login; token disimpan di `localStorage` dan dipakai untuk request API berikutnya.
  - **Halaman admin untuk CRUD event.** Admin dapat menambah, mengubah, dan menghapus data pertunjukan langsung dari frontend.
  - **Form kontak publik.** Pengunjung dapat mengirim pesan kontak; pesan disimpan ke database dan memicu email notifikasi ke admin serta auto-reply ke pengirim.
  - **Backend pembelian tiket.** API mendukung pembelian tiket, riwayat tiket, detail tiket, dan pembatalan tiket, lengkap dengan update kuota event dan email konfirmasi.
  - **Konten statis branding.** Halaman Tentang, Blog, FAQ, dan informasi brand SeniLokal ditulis langsung di frontend sebagai konten statis.

## 2. Teknologi yang Digunakan

- **Bahasa pemrograman utama:** JavaScript.
- **Runtime backend:** Node.js.
- **Framework utama:** Express.
  - Dipakai untuk HTTP server, routing API, middleware, parsing request body, dan static file serving.
- **Database:** MySQL.
  - Akses database memakai `mysql2/promise` dengan connection pool.
- **Frontend:** HTML, CSS, dan JavaScript vanilla.
  - Tidak ada framework frontend seperti React/Vue.
  - Seluruh frontend dirender dari satu file `public/index.html`.
- **Library / package penting:**
  - `express`: framework server HTTP.
  - `cors`: mengatur origin frontend yang diizinkan mengakses API.
  - `dotenv`: membaca konfigurasi dari file `.env`.
  - `mysql2`: koneksi MySQL berbasis promise.
  - `bcryptjs`: hashing password saat registrasi dan verifikasi saat login.
  - `jsonwebtoken`: membuat dan memverifikasi JWT untuk autentikasi.
  - `express-validator`: validasi input pada endpoint auth, kontak, tiket, dan event.
  - `nodemailer`: mengirim email konfirmasi tiket dan email terkait form kontak.
  - `nodemon` (dev dependency): auto-reload server saat development.
- **Design system / UI framework:** tidak ada framework UI.
  - Styling dibuat manual di `public/style.css`.
  - Desain memakai token CSS custom properties seperti `--saffron`, `--gold`, `--cream`, `--dark`.
  - Font memakai Google Fonts: `Playfair Display`, `Lora`, dan `DM Sans`.
- **Tools tambahan / concern penting:**
  - **Authentication:** JWT bearer token.
  - **API client di frontend:** `fetch` native browser, dibungkus helper `apiRequest`.
  - **Email service:** SMTP Gmail via Nodemailer.
  - **Static asset serving:** `express.static()` melayani isi folder `public`.

## 3. Arsitektur & Alur Sistem

- **Arsitektur backend:** sederhana dan modular, paling dekat ke pola `Route -> Controller -> Database/Service-like helper`.
  - `routes/` mendefinisikan endpoint dan validasi.
  - `controllers/` berisi logic request/response.
  - `config/` berisi inisialisasi shared resource seperti database dan mailer.
  - `middleware/` berisi autentikasi dan otorisasi.
- **Arsitektur frontend:** single-page style tanpa router framework.
  - Satu file HTML berisi banyak section/halaman (`beranda`, `tentang`, `blog`, `kontak`, `masuk`, `daftar`, `admin`).
  - Navigasi dilakukan dengan menambah/menghapus class `active` pada elemen `.page`.
- **Pola aplikasi secara keseluruhan:** monolith kecil.
  - Satu server Express melayani API sekaligus file frontend statis.

### Alur data end-to-end

1. User membuka aplikasi.
2. Express melayani `public/index.html`, `public/style.css`, dan `public/config.js`.
3. JavaScript frontend membaca `API_BASE_URL`, memuat event dari `/api/events`, lalu merender card pertunjukan.
4. Saat user login/daftar/kirim kontak/admin CRUD event, frontend memanggil endpoint API dengan `fetch`.
5. Request masuk ke route Express yang relevan.
6. Route menjalankan validasi request dengan `express-validator`.
7. Jika lolos, controller menjalankan query MySQL melalui pool di `config/database.js`.
8. Untuk kasus tertentu, controller juga memanggil helper email di `config/mailer.js`.
9. Controller mengembalikan JSON response ke frontend.
10. Frontend menampilkan status sukses/gagal di area pesan UI.

### Authentication

- Registrasi dan login menghasilkan JWT.
- Token dikirim ke client dalam response JSON.
- Frontend menyimpan token di `localStorage` dengan key `senilokal_token`.
- Data user juga disimpan di `localStorage` dengan key `senilokal_user`.
- Request yang membutuhkan login otomatis menambahkan header:
  - `Authorization: Bearer <token>`
- Middleware `authenticate`:
  - Memastikan header bearer token ada.
  - Memverifikasi token dengan `JWT_SECRET`.
  - Mengambil ulang user dari tabel `users`.
  - Menyimpan user ke `req.user`.
- Middleware `adminOnly`:
  - Mengecek `req.user.role === 'admin'`.
  - Menolak akses selain admin dengan status `403`.

### State management

- Tidak ada state management library.
- State frontend disimpan secara lokal dalam variabel global:
  - `currentUser`
  - `authToken`
  - `eventsCache`
- State persisten hanya memakai `localStorage`.
- UI auth diperbarui oleh fungsi `updateAuthUi()`.

### API handling

- Seluruh request frontend menggunakan helper `apiRequest(path, options)`.
- Helper ini:
  - Menyusun URL final dari `API_BASE_URL`.
  - Menambahkan header `Content-Type: application/json`.
  - Menambahkan header `Authorization` jika token ada.
  - Menganggap response non-OK atau `success === false` sebagai error.
- Endpoint API dikelompokkan ke empat domain:
  - `/api/auth`
  - `/api/events`
  - `/api/tiket`
  - `/api/kontak`

### Mekanisme pembelian tiket

- Endpoint pembelian tiket berada di backend dan memerlukan login.
- Controller tiket memakai transaksi database untuk menjaga konsistensi stok.
- Query `SELECT ... FOR UPDATE` dipakai saat membeli atau membatalkan tiket agar kuota event tidak balapan antar request.
- Setelah pembelian sukses:
  - tiket disimpan ke tabel `tikets`
  - `tiket_terjual` dan `status` event diperbarui
  - email konfirmasi dikirim secara non-blocking

## 4. Struktur Folder & Penjelasan Detail

### Struktur folder

```text
Website-Gening-Gendari-PABP/
├── config/
│   ├── database.js
│   └── mailer.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   ├── kontakController.js
│   └── tiketController.js
├── middleware/
│   └── auth.js
├── public/
│   ├── config.js
│   ├── index.html
│   └── style.css
├── routes/
│   ├── auth.js
│   ├── events.js
│   ├── kontak.js
│   └── tiket.js
├── .env
├── .env.example
├── database.sql
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── PROJECT_CONTEXT.md
```

### Fungsi setiap folder

- `config/`
  - Menyimpan konfigurasi global yang dipakai lintas modul.
  - `database.js` membuat MySQL connection pool dan mengetes koneksi saat startup.
  - `mailer.js` membuat transporter Nodemailer serta template email.
- `controllers/`
  - Pusat business logic per domain.
  - Setiap controller menangani validasi hasil route, query database, formatting response, dan side effect seperti email.
- `middleware/`
  - Menyimpan middleware reusable untuk autentikasi dan otorisasi admin.
- `public/`
  - Frontend statis aplikasi.
  - Tidak ada bundler atau build process frontend.
- `routes/`
  - Mendefinisikan endpoint, HTTP method, middleware auth, dan validation rules.

### File-file penting

- `server.js`
  - Entry point aplikasi.
  - Memuat environment variable, membuat app Express, mengaktifkan CORS, parser body, logger development, static file serving, semua route API, health check, 404 handler, dan global error handler.
- `package.json`
  - Menentukan nama package, dependency, dan script `start` serta `dev`.
- `database.sql`
  - Sumber kebenaran schema database.
  - Membuat database `senilokal_db`, empat tabel utama, dan seed event awal.
- `.env.example`
  - Referensi variabel environment yang dibutuhkan agar project dapat dijalankan.
- `config/database.js`
  - Membuat pool MySQL dengan `connectionLimit: 10`.
  - Jika koneksi awal gagal, proses dihentikan dengan `process.exit(1)`.
- `config/mailer.js`
  - Menyediakan tiga helper:
    - `kirimKonfirmasiTiket`
    - `kirimNotifikasiKontak`
    - `kirimAutoReplyKontak`
  - Juga berisi helper format tanggal Indonesia dan format Rupiah.
- `middleware/auth.js`
  - `authenticate` untuk login-required endpoint.
  - `adminOnly` untuk endpoint admin.
- `routes/auth.js`
  - Route registrasi, login, dan profil user.
  - Berisi validation rule untuk data auth.
- `routes/events.js`
  - Route list/detail event publik dan CRUD event admin.
- `routes/kontak.js`
  - Route kirim pesan publik serta admin access untuk melihat dan update status pesan.
- `routes/tiket.js`
  - Semua route tiket dilindungi `authenticate`.
- `controllers/authController.js`
  - Registrasi user, login via username atau email, dan ambil profil user aktif.
- `controllers/eventController.js`
  - Query event dengan filter, detail event, tambah/update/hapus event.
- `controllers/kontakController.js`
  - Simpan pesan kontak dan kirim email terkait.
- `controllers/tiketController.js`
  - Logic pembelian tiket, riwayat, detail, dan pembatalan tiket.
- `public/config.js`
  - Menyediakan `window.SENILOKAL_CONFIG.API_BASE_URL`.
  - Default ke `http://localhost:3000/api`.
- `public/index.html`
  - File frontend utama.
  - Memuat semua halaman aplikasi dan seluruh JavaScript browser-side.
- `public/style.css`
  - Styling lengkap aplikasi, termasuk layout responsive dan panel admin.

### Pola struktur code

- Backend memakai pola modular berdasarkan domain (`auth`, `events`, `kontak`, `tiket`).
- Frontend tidak memakai pemisahan file JS modular; seluruh logic ada inline di `index.html`.
- Project tidak memakai pola feature folder di frontend; semua UI, markup, dan logic browser disatukan.

## 5. Konvensi & Gaya Coding

- **Gaya coding umum:**
  - Cenderung sederhana, langsung, dan pragmatis.
  - Memisahkan routing, controller, config, dan middleware.
  - Menggunakan async/await untuk seluruh I/O utama.
  - Response API relatif konsisten memakai bentuk:
    - `success: true/false`
    - `message`
    - payload spesifik seperti `user`, `events`, `tiket`, atau `pesan`
- **Naming convention:**
  - File backend memakai camelCase deskriptif, misalnya `authController.js`, `tiketController.js`.
  - Nama function juga deskriptif dalam bahasa Indonesia, misalnya `daftar`, `masuk`, `beliTiket`, `semuaEvent`.
  - Nama tabel database menggunakan snake_case sederhana atau bentuk plural, misalnya `users`, `events`, `tikets`, `pesan_kontak`.
  - Key JSON request/response juga dominan berbahasa Indonesia.
- **Struktur penulisan code:**
  - Route:
    - import controller dan middleware
    - definisikan validation rule
    - registrasikan endpoint
  - Controller:
    - baca `validationResult` bila perlu
    - baca input dari `req`
    - query database
    - kirim response JSON
    - tangani error dengan `try/catch`
  - Frontend:
    - deklarasi helper global
    - fungsi UI/navigation
    - fungsi request API
    - fungsi render
    - fungsi event handler
    - binding event listener di bagian akhir
- **Cara handle error:**
  - Backend menangani error per controller dengan `try/catch`.
  - Error validasi mengembalikan `400`.
  - Data tidak ditemukan mengembalikan `404`.
  - Akses tidak sah mengembalikan `401` atau `403`.
  - Konflik data registrasi mengembalikan `409`.
  - Error server umum mengembalikan `500` dengan pesan generik.
  - Frontend menangkap exception dari `apiRequest` dan menampilkan pesan ke elemen `.status-message`.
- **Cara reusable code dibuat:**
  - Reusable backend:
    - middleware auth
    - helper mailer
    - helper `eventPayload` di controller event
  - Reusable frontend:
    - `apiRequest`
    - `setMessage`
    - `formatRupiah`
    - `formatTanggal`
    - `updateAuthUi`

## 6. Cara Menjalankan Project

### Prasyarat

- Node.js dan npm
- MySQL server aktif
- Akun email SMTP Gmail dengan app password jika ingin fitur email berjalan

### Langkah install

1. Install dependency:

```bash
npm install
```

2. Buat database dari file schema:

```bash
mysql -u root -p
```

Lalu jalankan isi `database.sql` atau gunakan perintah `source` di MySQL client.

3. Salin file environment:

```bash
cp .env.example .env
```

Di Windows biasanya setara dengan menyalin manual file `.env.example` menjadi `.env`.

4. Isi variabel penting di `.env`:
  - `PORT`
  - `NODE_ENV`
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `EMAIL_HOST`
  - `EMAIL_PORT`
  - `EMAIL_USER`
  - `EMAIL_PASS`
  - `EMAIL_FROM`
  - `FRONTEND_URL`

### Menjalankan project

- Mode development:

```bash
npm run dev
```

- Mode production sederhana:

```bash
npm start
```

### Akses aplikasi

- Backend + frontend dilayani dari server yang sama:
  - `http://localhost:3000`
- API base default:
  - `http://localhost:3000/api`

### Script penting

- `npm run dev`
  - Menjalankan `nodemon server.js`
- `npm start`
  - Menjalankan `node server.js`

### Catatan menjalankan frontend

- Karena `server.js` memakai `express.static(public)`, frontend dapat diakses langsung dari server Express.
- File `public/config.js` juga mengizinkan override base URL API dengan mengisi `window.SENILOKAL_API_BASE_URL` sebelum file itu dimuat.
- Ada konfigurasi CORS `FRONTEND_URL=http://localhost:5500`, yang menunjukkan project ini juga pernah didesain untuk kemungkinan frontend dibuka terpisah dari static server lain.

## 7. Insight Teknis Tambahan

### Keputusan teknis penting

- **Express + MySQL dipilih untuk kesederhanaan.**
  - Cocok untuk project akademik, prototipe, atau aplikasi skala kecil-menengah dengan alur CRUD yang jelas.
- **Frontend vanilla tanpa build tool.**
  - Mengurangi kompleksitas setup.
  - Memudahkan deploy sederhana.
- **JWT untuk auth stateless.**
  - Praktis untuk frontend yang memanggil API langsung.
- **MySQL transaction untuk tiket.**
  - Keputusan ini tepat karena stok tiket adalah data yang rawan race condition.
- **Email dijalankan non-blocking.**
  - Request utama tidak menunggu email selesai dikirim, sehingga respons API lebih cepat dan kegagalan email tidak membatalkan operasi bisnis utama.

### Potensi improvement

- **Pisahkan frontend JavaScript dari `index.html`.**
  - Saat ini logic UI, state, dan API handling berada dalam satu file besar sehingga sulit dirawat.
- **Tambah layer service/repository.**
  - Controller sekarang langsung menangani query SQL dan sebagian aturan bisnis.
- **Tambah fitur refresh token / logout server-side.**
  - Saat ini auth hanya mengandalkan JWT di client.
- **Perkuat validasi dan sanitasi output.**
  - Template email dan render HTML memakai data user secara langsung.
- **Gunakan ORM atau query builder.**
  - Saat ini query raw SQL masih manageable, tetapi akan sulit saat domain membesar.
- **Tambahkan testing.**
  - Tidak ditemukan unit test maupun integration test.
- **Tambahkan observability.**
  - Logging masih minimal dan hanya aktif di development untuk request log.
- **Tambah pagination/filter lanjutan.**
  - Endpoint event saat ini mengembalikan semua data sesuai filter tanpa pagination.

### Known limitation / technical debt

- **Frontend belum memanfaatkan semua API backend.**
  - Backend punya pembelian tiket, riwayat tiket, detail tiket, dan pembatalan tiket.
  - Frontend saat ini belum menyediakan alur UI lengkap untuk fitur-fitur tersebut.
- **Tombol `Detail` event belum terhubung ke detail page atau modal.**
  - Di hasil render event, tombol muncul tetapi tidak ada handler pembukaan detail event.
- **Halaman blog bersifat statis.**
  - Search bar dan artikel blog tidak terhubung ke backend atau CMS.
- **Manajemen admin hanya untuk event.**
  - Tidak ada UI admin untuk melihat pesan kontak atau mengelola tiket, walau API backend sudah sebagian mendukung kontak admin.
- **Tidak ada sistem pembayaran nyata.**
  - `metode_bayar` hanya dicatat ke database; belum ada integrasi payment gateway.
- **`localStorage` dipakai langsung untuk token.**
  - Praktis, tetapi kurang aman dibanding pendekatan cookie httpOnly.
- **Credential environment sensitif sangat penting.**
  - Jika `JWT_SECRET` lemah atau email credential salah, fitur auth/email akan bermasalah.
- **Seed data event di `database.sql` memakai tanggal tahun 2025.**
  - Untuk penggunaan saat ini, sebagian data kemungkinan sudah lewat tanggalnya.
- **Ada indikasi masalah encoding karakter pada beberapa file.**
  - Beberapa emoji tampil rusak saat dibaca dari terminal, kemungkinan karena encoding file/console.

### Asumsi yang dibuat

- Project ini kemungkinan dibuat sebagai aplikasi demonstrasi atau tugas kuliah dengan fokus keseimbangan antara backend API dan presentasi UI.
- Frontend dimaksudkan sebagai landing page interaktif plus panel admin sederhana, bukan aplikasi ticketing penuh end-to-end.
- Nama folder repo `Website-Gening-Gendari-PABP` menunjukkan konteks branding lokal/akademik, tetapi identitas aplikasi yang dipakai di kode adalah `SeniLokal`.

## 8. Ringkasan untuk AI

- Project ini adalah aplikasi web `SeniLokal` untuk listing pertunjukan seni budaya Indonesia, auth user, kontak, admin CRUD event, dan backend ticketing.
- Stack utamanya adalah Node.js, Express, MySQL, HTML/CSS/JavaScript vanilla, JWT, bcrypt, express-validator, dan Nodemailer.
- Struktur backend mengikuti pola modular `routes -> controllers -> config/middleware`, sedangkan frontend adalah satu file `public/index.html` dengan script inline.
- Token auth disimpan di `localStorage`, API dipanggil via helper `fetch`, dan static frontend dilayani langsung oleh Express.
- Fitur backend lebih lengkap daripada frontend; API tiket dan sebagian alur admin belum memiliki UI yang setara.
- Sebelum membantu project ini, AI perlu tahu bahwa banyak konten frontend masih statis, query database ditulis manual, dan perubahan besar sebaiknya mempertimbangkan pemisahan frontend script serta penambahan layer service/testing.
