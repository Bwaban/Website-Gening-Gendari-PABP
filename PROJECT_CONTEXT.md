# 🧠 PROJECT CONTEXT: SeniLokal (Gening Gendari)

Dokumentasi ini dibuat untuk memberikan gambaran menyeluruh mengenai proyek **SeniLokal**, sebuah platform digital untuk pelestarian dan manajemen acara seni budaya Indonesia. File ini dirancang sebagai referensi utama bagi AI atau pengembang baru untuk memahami sistem tanpa harus membaca seluruh kode sumber.

---

## 1. Informasi Umum
- **Nama Project**: SeniLokal (Gening Gendari)
- **Deskripsi Project**: Platform web *end-to-end* yang berfokus pada promosi, edukasi, dan reservasi tiket pertunjukan seni budaya Indonesia, khususnya seni "Gending Gandari" dan tradisi Sunda/Jawa lainnya.
- **Tujuan Utama**: 
  - Mendigitalisasi proses pemesanan tiket pertunjukan seni lokal.
  - Memberikan platform bagi seniman untuk menjangkau audiens lebih luas.
  - Menyediakan informasi terpusat mengenai jadwal dan detail acara kebudayaan.
- **Target User**: 
  - Penikmat seni budaya (Masyarakat umum).
  - Wisatawan yang mencari hiburan autentik lokal.
  - Admin/Penyelenggara acara untuk mengelola inventaris tiket.
- **Fitur Utama**:
  - **Manajemen Event**: Eksplorasi daftar pertunjukan dengan filter kategori (Wayang, Tari, Gending, dll).
  - **Sistem Booking**: Alur pemesanan tiket mulai dari pemilihan jumlah hingga pengisian data pemesan.
  - **Payment & E-Ticket**: Proses konfirmasi pembayaran (unggah bukti) dan pembuatan E-Ticket otomatis dalam format PDF.
  - **Blog/Edukasi**: Artikel mengenai sejarah dan nilai-nilai seni budaya.
  - **Admin Dashboard**: Panel kontrol untuk mengelola event, memantau penjualan tiket, dan merespons pesan masuk.

---

## 2. Teknologi yang Digunakan
### Frontend
- **React (v18)**: Framework UI utama dengan pendekatan fungsional dan Hooks.
- **TypeScript**: Digunakan di seluruh codebase untuk *type-safety*.
- **Vite**: Alat *build* dan *bundler* yang sangat cepat untuk pengembangan.
- **Tailwind CSS**: Framework CSS untuk styling responsif dengan sistem desain berbasis utility.
- **React Router Dom**: Library navigasi untuk aplikasi satu halaman (SPA).
- **Axios**: Klien HTTP untuk berkomunikasi dengan Backend API.
- **jsPDF & html2canvas**: Library untuk menghasilkan dokumen PDF (E-Ticket) secara dinamis dari elemen HTML.

### Backend
- **Node.js & Express**: Lingkungan runtime dan framework server minimalis.
- **MySQL (mysql2)**: Database relasional untuk menyimpan data user, event, dan transaksi.
- **JWT (JSON Web Token)**: Mekanisme otentikasi stateless antara frontend dan backend.
- **Bcryptjs**: Library untuk enkripsi password sebelum disimpan ke database.
- **Multer**: Middleware untuk menangani unggahan file (gambar event & bukti bayar).
- **Nodemailer**: Digunakan untuk pengiriman notifikasi email (jika dikonfigurasi).

---

## 3. Arsitektur & Alur Sistem
### Arsitektur
Sistem menggunakan arsitektur **Client-Server (REST API)** yang terpisah:
- **Frontend**: Single Page Application (SPA) yang berjalan di client.
- **Backend**: RESTful API yang melayani data dalam format JSON.
- **Database**: Skema relasional MySQL.

### Alur Data End-to-End
1. **User Interaction**: User memilih event di Frontend (React).
2. **API Request**: Frontend mengirimkan request ke Backend melalui Axios (misal: `POST /api/tiket/booking`).
3. **Controller & Business Logic**: Backend menerima request, memvalidasi input (express-validator), dan mengecek logika bisnis (kuota tiket).
4. **Database Interaction**: Backend melakukan query ke MySQL untuk menyimpan data pesanan.
5. **Response**: Backend mengembalikan status sukses dan data terkait ke Frontend.
6. **UI Update**: Frontend memperbarui state dan mengarahkan user ke halaman berikutnya (misal: Halaman Pembayaran).

### Keamanan & State Management
- **Authentication**: Menggunakan JWT yang disimpan di `localStorage` atau `cookie`. Backend memverifikasi token di setiap *protected route* melalui middleware.
- **Authorization**: Terdapat pemisahan role antara `user` dan `admin`.
- **State Management**: Menggunakan **React Context API** (`AuthContext`) untuk mengelola status login user secara global di seluruh aplikasi.

---

## 4. Struktur Folder & Penjelasan Detail

### Struktur Root
```text
.
├── backend/                # Source code server (Express)
├── frontend/               # Source code client (React)
├── node_modules/           # Dependencies
└── package.json            # Scripts & global info
```

### Detail Frontend (`frontend/src/`)
- `api/`: Definisi endpoint dan konfigurasi Axios.
- `assets/`: File statis seperti logo, gambar default, dan icon.
- `components/`: Komponen UI yang dapat digunakan kembali (Navbar, Footer, Card, Modal).
- `context/`: Provider global (terutama `AuthContext.tsx`).
- `hooks/`: Custom hooks untuk logika yang bisa digunakan ulang.
- `pages/`: Halaman utama aplikasi (Home, Login, Register, dll).
  - `admin/`: Sub-folder khusus halaman dashboard admin.
- `types/`: Definisi Interface TypeScript untuk standarisasi data (User, Event, Ticket).
- `utils/`: Fungsi pembantu (formatting mata uang, tanggal, validator).

### Detail Backend (`backend/`)
- `config/`: Konfigurasi database dan environment.
- `controllers/`: Logika bisnis utama untuk setiap entitas (User, Event, Tiket).
- `middleware/`: Fungsi penengah (Auth checking, File upload handler, Validation).
- `routes/`: Definisi endpoint API (Routing).
- `public/`: File statis yang diakses publik (unggahan gambar).
- `server.js`: Titik masuk utama aplikasi backend.
- `database.sql`: File skema database untuk inisialisasi awal.

---

## 5. Konvensi & Gaya Coding
- **Clean Code & DRY**: Menghindari duplikasi kode dengan membuat komponen dan utilitas yang *reusable*.
- **Naming Convention**:
  - File React: `PascalCase` (Contoh: `EventCard.tsx`).
  - Variabel & Fungsi: `camelCase`.
  - Konstanta/Env: `UPPER_SNAKE_CASE`.
- **Struktur Penulisan**:
  - Pemisahan antara *UI Component* (presentasi) dan *Logic* (Hooks/API).
  - Penggunaan CSS Tailwind langsung di dalam JSX untuk kecepatan pengembangan.
- **Error Handling**:
  - Frontend: Menggunakan blok `try-catch` pada panggilan API dengan notifikasi user yang ramah (Toast/Alert).
  - Backend: Middleware error handler global untuk menangkap error 500 dan format response error yang seragam `{ success: false, message: ... }`.

---

## 6. Cara Menjalankan Project

### Prasyarat
- Node.js (v16+)
- MySQL Server
- NPM atau Yarn

### Langkah Instalasi
1. **Clone Repository**.
2. **Setup Backend**:
   - Masuk ke folder `backend`.
   - Jalankan `npm install`.
   - Buat file `.env` berdasarkan `.env.example`.
   - Import `database.sql` ke MySQL Anda.
3. **Setup Frontend**:
   - Masuk ke folder `frontend`.
   - Jalankan `npm install`.
   - Buat file `.env` (isi `VITE_API_URL`).

### Menjalankan Aplikasi (Mode Dev)
- **Backend**: `npm run dev` (berjalan di port 3000 secara default).
- **Frontend**: `npm run dev` (berjalan di port Vite, biasanya 5173).

---

## 7. Insight Teknis Tambahan
- **Keputusan Teknis**: Penggunaan **React** dan **Vite** dipilih karena performa rendering yang cepat dan ekosistem library yang luas. **Tailwind CSS** digunakan untuk mempercepat proses desain tanpa menulis CSS manual yang panjang.
- **Simulasi Pembayaran**: Karena project ini bersifat edukasi/PABP, sistem pembayaran dilakukan dengan cara unggah bukti transfer manual yang kemudian divalidasi oleh admin.
- **Optimasi**: Penggunaan PDF generation di sisi client (frontend) mengurangi beban server dalam memproses file dokumen.
- **Keterbatasan**: Saat ini belum ada integrasi *payment gateway* otomatis (seperti Midtrans/Stripe), semua transaksi masih bersifat manual.

---

## 8. Ringkasan untuk AI
Jika Anda membantu mengembangkan proyek ini, perhatikan poin berikut:
- **Tujuan**: Platform reservasi tiket seni budaya (SeniLokal).
- **Stack**: React (TS) + Express + MySQL + Tailwind.
- **Pola**: Frontend memisahkan antara `pages` dan `components`. Backend menggunakan pola `Routes -> Controllers`.
- **Autentikasi**: JWT Token disimpan di client, dicek via Middleware di server.
- **Hal Penting**: Pastikan setiap perubahan pada skema database dicatat, dan selalu gunakan TypeScript interfaces yang ada di `frontend/src/types` saat menambah fitur baru.

---
*Catatan: Project ini merupakan bagian dari tugas PABP (Pendidikan Agama dan Budi Pekerti) dengan tema kebudayaan.*
