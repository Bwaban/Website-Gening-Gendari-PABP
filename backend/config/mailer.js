const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Format tanggal ke format Indonesia
 */
const formatTanggal = (date) => {
  return new Date(date).toLocaleString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }) + ' WIB';
};

/**
 * Format harga ke format Rupiah
 */
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

/**
 * Email konfirmasi pembelian tiket
 */
const kirimKonfirmasiTiket = async ({ to, nama, kode_tiket, judul_event, tanggal, lokasi, jumlah, total_harga, metode_bayar }) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || 'SeniLokal <noreply@senilokal.id>',
    to,
    subject: `🎫 Konfirmasi Tiket – ${judul_event}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#4A3218,#C8792A);padding:32px;text-align:center">
          <div style="font-size:36px">🎵</div>
          <h1 style="color:#fff;margin:8px 0;font-size:24px">SeniLokal</h1>
          <p style="color:rgba(255,255,255,0.8);margin:0">Konfirmasi Pembelian Tiket</p>
        </div>
        <div style="padding:32px">
          <p style="color:#374151">Halo <strong>${nama}</strong>,</p>
          <p style="color:#374151">Tiket Anda telah berhasil dibeli. Berikut detailnya:</p>
          <div style="background:#f9fafb;border-radius:8px;padding:24px;margin:20px 0;border-left:4px solid #C8792A">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#6b7280;width:40%">Kode Tiket</td><td style="padding:6px 0;font-weight:bold;color:#111827;font-family:monospace;font-size:16px">${kode_tiket}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Pertunjukan</td><td style="padding:6px 0;color:#111827">${judul_event}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Tanggal</td><td style="padding:6px 0;color:#111827">${formatTanggal(tanggal)}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Lokasi</td><td style="padding:6px 0;color:#111827">${lokasi}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Jumlah Tiket</td><td style="padding:6px 0;color:#111827">${jumlah} tiket</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Total Bayar</td><td style="padding:6px 0;font-weight:bold;color:#C8792A;font-size:18px">${formatRupiah(total_harga)}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Metode Bayar</td><td style="padding:6px 0;color:#111827">${metode_bayar === 'transfer_bank' ? 'Transfer Bank' : 'Dompet Digital'}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Status</td><td style="padding:6px 0"><span style="background:#fef3c7;color:#92400e;padding:2px 10px;border-radius:999px;font-size:13px">Menunggu Pembayaran</span></td></tr>
            </table>
          </div>
          <p style="color:#374151;background:#fef9ee;padding:16px;border-radius:8px;border:1px solid #fde68a">
            📌 <strong>Simpan kode tiket Anda.</strong> Kode tiket akan diperlukan saat memasuki venue pertunjukan.
          </p>
          <p style="color:#6b7280;font-size:14px">Terima kasih telah mendukung seni budaya Indonesia! 🙏</p>
        </div>
        <div style="background:#f3f4f6;padding:16px;text-align:center;color:#9ca3af;font-size:13px">
          © 2025 SeniLokal • Platform Seni Budaya Indonesia
        </div>
      </div>
    `,
  });
};

/**
 * Email notifikasi kontak masuk (ke admin)
 */
const kirimNotifikasiKontak = async ({ nama, email, subjek, pesan }) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.EMAIL_USER,
    subject: `📬 Pesan Kontak Baru: ${subjek}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#4A3218">Pesan Kontak Baru – SeniLokal</h2>
        <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;padding:16px">
          <tr><td style="padding:8px;color:#6b7280;width:30%">Nama</td><td style="padding:8px"><strong>${nama}</strong></td></tr>
          <tr><td style="padding:8px;color:#6b7280">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;color:#6b7280">Subjek</td><td style="padding:8px">${subjek}</td></tr>
          <tr><td style="padding:8px;color:#6b7280;vertical-align:top">Pesan</td><td style="padding:8px">${pesan.replace(/\n/g, '<br>')}</td></tr>
        </table>
      </div>
    `,
  });
};

/**
 * Auto-reply email ke pengirim kontak
 */
const kirimAutoReplyKontak = async ({ nama, email }) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: '✅ Pesan Anda Telah Kami Terima – SeniLokal',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#4A3218,#C8792A);padding:24px;text-align:center;border-radius:12px 12px 0 0">
          <div style="font-size:32px">🎵</div>
          <h2 style="color:#fff;margin:8px 0">SeniLokal</h2>
        </div>
        <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Halo <strong>${nama}</strong>,</p>
          <p>Terima kasih telah menghubungi kami! Pesan Anda telah kami terima dan tim kami akan merespons dalam <strong>1–2 hari kerja</strong>.</p>
          <p style="color:#6b7280">Salam hangat,<br><strong>Tim SeniLokal</strong></p>
        </div>
      </div>
    `,
  });
};

module.exports = { kirimKonfirmasiTiket, kirimNotifikasiKontak, kirimAutoReplyKontak };
