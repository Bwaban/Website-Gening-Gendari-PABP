-- =============================================
-- SENILOKAL DATABASE SCHEMA
-- Jalankan file ini di MySQL untuk membuat tabel
-- =============================================

CREATE DATABASE IF NOT EXISTS senilokal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE senilokal_db;

-- -------------------------
-- Tabel: users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(100)  NOT NULL,
  username    VARCHAR(50)   NOT NULL UNIQUE,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  telepon     VARCHAR(20),
  kota        VARCHAR(100),
  umur        TINYINT UNSIGNED,
  role        ENUM('user','admin') DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -------------------------
-- Tabel: events (pertunjukan)
-- -------------------------
CREATE TABLE IF NOT EXISTS events (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  judul           VARCHAR(200)  NOT NULL,
  kategori        ENUM('Gending Gandari','Karawitan','Wayang','Tari Tradisional') NOT NULL,
  deskripsi       TEXT,
  tanggal         DATETIME      NOT NULL,
  kota            VARCHAR(100)  NOT NULL,
  lokasi          VARCHAR(255)  NOT NULL,
  harga           INT           NOT NULL DEFAULT 0,
  kuota           INT           NOT NULL DEFAULT 100,
  tiket_terjual   INT           NOT NULL DEFAULT 0,
  status          ENUM('tersedia','terbatas','habis') DEFAULT 'tersedia',
  gradient_style  VARCHAR(200),
  emoji           VARCHAR(10),
  gambar_url      VARCHAR(255),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -------------------------
-- Tabel: tikets (pembelian)
-- -------------------------
CREATE TABLE IF NOT EXISTS tikets (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  kode_tiket      VARCHAR(20)   NOT NULL UNIQUE,
  user_id         INT           NOT NULL,
  event_id        INT           NOT NULL,
  jumlah          TINYINT       NOT NULL DEFAULT 1,
  total_harga     INT           NOT NULL,
  metode_bayar    ENUM('transfer_bank','qris') NOT NULL,
  status_bayar    ENUM('menunggu','lunas','dibatalkan','refund') DEFAULT 'menunggu',
  nama_pemesan    VARCHAR(100)  NOT NULL,
  email_pemesan   VARCHAR(150)  NOT NULL,
  telepon_pemesan VARCHAR(20),
  catatan         TEXT,
  bukti_bayar     VARCHAR(255),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- -------------------------
-- Tabel: pesan_kontak
-- -------------------------
CREATE TABLE IF NOT EXISTS pesan_kontak (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  subjek      VARCHAR(200) NOT NULL,
  pesan       TEXT         NOT NULL,
  status      ENUM('baru','dibaca','dibalas') DEFAULT 'baru',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- Data awal: events contoh
-- -------------------------
INSERT INTO events (judul, kategori, deskripsi, tanggal, kota, lokasi, harga, kuota, tiket_terjual, status, gradient_style, emoji, gambar_url) VALUES
('Pagelaran Gending Gandari Malam Bulan Purnama', 'Gending Gandari', 'Nikmati keindahan Gending Gandari di bawah sinar bulan purnama dalam suasana yang magis dan penuh makna.', '2025-06-15 19:00:00', 'Bandung', 'Gedung Kesenian Jawa Barat, Bandung', 75000, 200, 80, 'tersedia', 'linear-gradient(135deg,#4A3218,#C8792A)', '🎼', '/images/events/gending_bulan.jpg'),
('Festival Karawitan Nusantara – Gamelan Ageng',  'Karawitan',       'Festival tahunan yang menampilkan ensemble gamelan terbesar dan terbaik dari seluruh penjuru Indonesia.', '2025-06-22 10:00:00', 'Yogyakarta', 'Taman Budaya Yogyakarta', 50000, 150, 140, 'terbatas', 'linear-gradient(135deg,#1C3A2A,#2A7A4A)', '🪘', '/images/events/festival_karawitan.jpg'),
('Gending Gandari: Pusaka Sunda yang Abadi',      'Gending Gandari', 'Pertunjukan eksklusif yang menampilkan komposisi Gending Gandari klasik dan modern dalam satu malam yang tak terlupakan.', '2025-07-04 20:00:00', 'Bandung', 'Gedung Merdeka, Bandung', 100000, 120, 30, 'tersedia', 'linear-gradient(135deg,#2A1A3A,#6A2A8A)', '🎭', '/images/events/pusaka_sunda.jpg'),
('Wayang Golek – Lakon Ramayana dengan Gending Sunda', 'Wayang',     'Pertunjukan wayang golek semalam suntuk dengan iringan Gending Sunda yang memukau.',                    '2025-07-12 21:00:00', 'Bandung', 'Saung Angklung Udjo, Bandung', 120000, 100, 100, 'habis', 'linear-gradient(135deg,#3A1A10,#8A3A1A)', '🥁', '/images/events/wayang_golek.jpg'),
('Malam Gending: Harmoni Gandari dan Degung',     'Gending Gandari', 'Kolaborasi unik antara Gending Gandari dan Degung yang menghadirkan nuansa musikal Sunda yang kaya.',    '2025-07-17 18:30:00', 'Jakarta', 'Galeri Seni Nasional, Jakarta', 85000, 180, 50, 'tersedia', 'linear-gradient(135deg,#1A3A3A,#1A8A7A)', '🎶', '/images/events/harmoni_degung.jpg'),
('Tari Merak dengan Iringan Gending Jawa Barat',  'Tari Tradisional','Pertunjukan Tari Merak yang memukau diiringi Gending Jawa Barat yang merdu.',                             '2025-07-28 19:30:00', 'Solo', 'Pusat Kebudayaan Solo', 60000, 160, 145, 'terbatas', 'linear-gradient(135deg,#2A2A1A,#7A7A1A)', '🎵', '/images/events/tari_merak.jpg');
