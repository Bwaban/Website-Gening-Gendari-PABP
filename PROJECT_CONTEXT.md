# 🧠 PROJECT CONTEXT

## 1. Informasi Umum
- **Nama Project**: SeniLokal (Gening Gendari / Gending Gandari)
- **Deskripsi Project**: SeniLokal adalah platform web modern yang didedikasikan untuk pelestarian dan promosi seni budaya Indonesia. Domain utamanya adalah e-commerce seni budaya yang memungkinkan pengguna untuk menjelajahi berbagai pertunjukan seni tradisonal dan modern di Indonesia.
- **Tujuan Utama**: Mempermudah akses masyarakat terhadap pertunjukan seni budaya melalui sistem digitalisasi reservasi tiket (e-ticketing). Aplikasi ini menyelesaikan masalah sulitnya mendapatkan informasi pertunjukan seni yang tersebar dan proses pemesanan tiket yang masih manual.
- **Target User**: Pecinta seni budaya, turis (domestik & internasional), dan komunitas praktisi seni di Indonesia.
- **Fitur Utama**:
    - **E-Ticketing System**: Memungkinkan pengguna memilih kursi, memesan tiket, dan mendapatkan E-Ticket secara instan.
    - **Event Management**: Katalog pertunjukan seni lengkap dengan detail lokasi, waktu, dan deskripsi mendalam.
    - **Admin Dashboard**: Panel khusus pengelola untuk menambah, mengubah, atau menghapus data pertunjukan (CRUD Events).
    - **Blog & Literasi**: Bagian khusus artikel yang memberikan edukasi mengenai sejarah dan filosofi di balik pertunjukan seni yang ada.
    - **Auth & Profile**: Sistem pendaftaran akun dan riwayat tiket untuk melacak pertunjukan yang telah diikuti.

## 2. Teknologi yang Digunakan
- **Bahasa Pemrograman**: TypeScript (Frontend) & JavaScript (Backend).
- **Framework Utama**: 
    - **Frontend**: React.js (dengan Vite sebagai build tool) untuk UI yang responsif dan cepat.
    - **Backend**: Node.js dengan framework Express.js untuk menangani RESTful API.
- **Library / Packages Penting**:
    - **Axios**: Digunakan di frontend untuk melakukan request HTTP ke backend.
    - **Lucide React**: Library icon modern untuk mempercantik UI.
    - **JWT (jsonwebtoken)**: Untuk keamanan autentikasi berbasis token.
    - **Bcryptjs**: Untuk enkripsi password pengguna di database.
    - **MySQL2**: Driver untuk menghubungkan backend Node.js dengan database MySQL.
    - **Nodemailer**: Digunakan untuk pengiriman notifikasi atau tiket melalui email (asumsi berdasarkan package.json).
- **Design System / UI Framework**: 
    - **Tailwind CSS**: Framework CSS utility-first yang digunakan untuk styling yang konsisten dan premium.
    - **Custom Design System**: Menggunakan palet warna khusus (Saffron, Gold, Cream, Dark) yang mencerminkan estetika budaya.
- **Tools Tambahan**: Nodemon (development), PostCSS, Autoprefixer.

## 3. Arsitektur & Alur Sistem
- **Arsitektur**: Menggunakan pola **Client-Server Separated Architecture**. Frontend dan Backend berjalan secara terpisah namun terhubung melalui API.
- **Alur Data End-to-End**:
    1. **User Interaction**: User berinteraksi dengan UI React (misal: klik tombol "Beli Tiket").
    2. **API Request**: Frontend mengirimkan request via Axios ke endpoint tertentu di Express (misal: `POST /api/tiket/booking`).
    3. **Controller Logic**: Backend (Controller) menerima request, melakukan validasi data (express-validator).
    4. **Database Operation**: Controller berinteraksi dengan database MySQL untuk menyimpan atau mengambil data.
    5. **Response**: Backend mengirimkan response JSON kembali ke Frontend.
    6. **UI Update**: React mengupdate state lokal dan menampilkan feedback ke user (misal: menampilkan E-Ticket).
- **Authentication**: Menggunakan **JWT Strategy**. Saat login berhasil, backend mengirimkan token yang kemudian disimpan di `localStorage` frontend untuk digunakan dalam header `Authorization` pada request berikutnya.
- **State Management**: Menggunakan **React Hooks (Context API)** untuk mengelola state global seperti status login pengguna (`useAuth`).

## 4. Struktur Folder & Penjelasan Detail
### Root Structure
```text
.
├── backend/            # Source code server (API)
├── frontend/           # Source code client (React)
└── README.md           # Dokumentasi instalasi awal
```

### Frontend Structure (`frontend/src/`)
- `api/`: Berisi konfigurasi Axios dan fungsi-fungsi pemanggilan API.
- `assets/`: File statis seperti gambar, logo, dan font.
- `components/`: Komponen UI yang reusable.
    - `layout/`: Navbar, Footer, Sidebar.
    - `ui/`: Komponen dasar seperti Button, Input, Card.
- `context/`: Implementasi React Context (misal: AuthContext).
- `hooks/`: Custom hooks untuk logika yang reusable (misal: `useAuth`).
- `pages/`: Komponen halaman utama (HomePage, LoginPage, dll).
- `types/`: Definisi interface TypeScript.
- `utils/`: Fungsi helper (format tanggal, manipulasi string).

### Backend Structure (`backend/`)
- `config/`: Konfigurasi database dan environment.
- `controllers/`: Logika bisnis utama untuk setiap fitur.
- `middleware/`: Fungsi penengah (misal: validasi token JWT, validasi input).
- `routes/`: Definisi endpoint API (Auth, Events, Tiket).
- `server.js`: Entry point utama aplikasi backend.

## 5. Konvensi & Gaya Coding
- **Gaya Coding**: Mengikuti prinsip **Clean Code** dan **DRY (Don't Repeat Yourself)** dengan memisahkan komponen UI kecil agar bisa digunakan kembali.
- **Naming Convention**:
    - **File Component**: PascalCase (Contoh: `Button.tsx`).
    - **Folder & Non-component**: lowercase atau kebab-case.
    - **Variable & Function**: camelCase.
- **Pemisahan Logic**: Logika pemanggilan API dipisahkan dari komponen visual (`pages/` vs `api/`).
- **Error Handling**: Menggunakan block `try-catch` di frontend (saat request API) dan backend (saat operasi database) dengan pengiriman pesan error yang user-friendly.

## 6. Cara Menjalankan Project
### Prasyarat
- Node.js terinstall.
- MySQL server berjalan.

### Langkah-langkah
1. **Setup Database**: Import file `database.sql` ke dalam database MySQL Anda.
2. **Backend**:
   ```bash
   cd backend
   npm install
   # Sesuaikan file .env dengan kredensial database Anda
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 7. Insight Teknis Tambahan
- **Keputusan Teknis**: Penggunaan TypeScript di frontend dipilih untuk meminimalisir error saat runtime dan memperjelas struktur data (terutama untuk data pertunjukan yang kompleks).
- **Potensi Improvement**:
    - Implementasi **Redis** untuk caching data event agar load time lebih cepat.
    - Penggunaan **Cloudinary** untuk manajemen asset gambar yang lebih efisien.
- **Known Limitation**: Saat ini sistem masih bergantung pada `localStorage` untuk penyimpanan token, yang memiliki sedikit risiko keamanan XSS dibandingkan `httpOnly cookies`.

## 8. Ringkasan untuk AI
- **Project ini adalah**: Platform e-ticketing seni budaya Indonesia bernama SeniLokal.
- **Stack utama**: React (Vite, TS, Tailwind) + Node.js (Express, MySQL).
- **Struktur utama**: Folder `frontend` untuk client, `backend` untuk server API.
- **Hal penting untuk AI**: 
    - Autentikasi menggunakan JWT.
    - Perhatikan pemisahan antara `pages` dan `components` di frontend.
    - Database menggunakan MySQL murni (bukan ORM seperti Prisma/Sequelize), jadi query ditulis secara manual atau via driver mysql2.
