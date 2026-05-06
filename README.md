# G2PRO – Website Pembelian Tiket Pertunjukan Gending Gandari

Platform pembelian tiket online untuk pertunjukan seni budaya tradisional Sunda (Gending Gandari, Karawitan, Wayang, Tari Tradisional).

---

## 🗂️ Struktur Proyek

```
Website-Gening-Gendari-PABP-main/
├── backend/    → Express.js + MySQL (API Server, port 3000)
└── frontend/   → React + Vite + TypeScript (UI, port 5173)
```

---

## ⚙️ Prasyarat

Pastikan semua tools berikut sudah terinstall sebelum memulai:

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [MySQL](https://www.mysql.com/) v8 atau lebih baru
- npm (sudah termasuk saat install Node.js)

---

## 🗄️ Setup Database

1. Buka MySQL (bisa via phpMyAdmin, HeidiSQL, atau terminal MySQL).

2. Buat database baru:
   ```sql
   CREATE DATABASE senilokal_db;
   ```

3. Import file SQL yang ada di folder `backend/`:
   ```bash
   mysql -u root -p senilokal_db < backend/database.sql
   ```
   Atau buka file `backend/database.sql` lalu jalankan isinya langsung di phpMyAdmin/HeidiSQL.

4. Pastikan tabel `events` sudah punya kolom `gambar_url`. Kalau belum, jalankan query ini:
   ```sql
   ALTER TABLE events ADD COLUMN gambar_url VARCHAR(255) AFTER emoji;
   ```

---

## 🔧 Setup Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` dengan menyalin dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Lalu buka file `.env` dan sesuaikan nilainya:
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=password_mysql_kamu
   DB_NAME=senilokal_db

   JWT_SECRET=isi_dengan_string_acak_yang_panjang

   # Opsional – untuk fitur notifikasi email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=emailkamu@gmail.com
   EMAIL_PASS=app_password_gmail_kamu
   EMAIL_FROM=SeniLokal <emailkamu@gmail.com>

   FRONTEND_URL=http://localhost:5173
   ```

4. Jalankan backend:
   ```bash
   npm run dev
   ```
   Backend akan berjalan di **http://localhost:3000**

---

## 🎨 Setup Frontend

> ⚠️ Buka terminal **baru** (jangan tutup terminal backend yang sedang berjalan).

1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan frontend:
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di **http://localhost:5173**

---

## 🚀 Cara Menjalankan (Ringkasan)

Backend dan frontend harus dijalankan **secara terpisah di dua terminal berbeda**.

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```

Setelah keduanya berjalan, buka browser dan akses:
```
http://localhost:5173
```

---

## 👤 Akun Default

Setelah import database, kamu bisa login menggunakan akun yang sudah ada di data awal (seed), atau daftar akun baru melalui halaman `/register`.

Untuk akses panel admin, pastikan akun memiliki role `admin` di tabel `users`.

---

## 📝 Catatan Tambahan

- Frontend secara otomatis mem-proxy request `/api` dan `/images` ke backend di port 3000 (sudah dikonfigurasi di `vite.config.ts`), jadi tidak perlu konfigurasi tambahan.
- Fitur upload gambar/bukti pembayaran disimpan di folder `backend/uploads/`.
- Jika menggunakan fitur notifikasi email, pastikan Gmail sudah mengaktifkan **App Password** (bukan password biasa).
