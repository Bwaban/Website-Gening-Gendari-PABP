import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import type { Tiket } from '../types'
import { formatRupiah, formatTanggalJam } from '../utils/helpers'
import { Upload, CheckCircle, Copy, CreditCard } from 'lucide-react'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const ticket = (location.state as { ticket?: Tiket } | null)?.ticket

  const [uploading, setUploading] = useState(false)
  const [buktiUrl, setBuktiUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  if (!ticket) {
    return <Navigate to="/riwayat" replace />
  }

  const isTransfer = ticket.metode_bayar === 'transfer_bank'

  const bankInfo = {
    bank: 'Bank Central Asia (BCA)',
    noRek: '123-456-7890',
    atasNama: 'PT SeniLokal Indonesia',
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('bukti', file)

      const token = localStorage.getItem('senilokal_token')
      const response = await fetch('/api/upload/bukti-bayar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengunggah bukti')
      }

      setBuktiUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah bukti pembayaran')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitProof = async () => {
    if (!buktiUrl) {
      setError('Silakan unggah bukti pembayaran terlebih dahulu.')
      return
    }

    try {
      setUploading(true)
      await apiRequest(`/tiket/${ticket.kode_tiket}/bukti`, {
        method: 'POST',
        body: JSON.stringify({ bukti_url: buktiUrl }),
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim bukti pembayaran')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  if (submitted) {
    return (
      <div className="container-page py-14">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cultureGreen/10">
            <CheckCircle className="h-12 w-12 text-cultureGreen" />
          </div>
          <div className="space-y-3">
            <h1 className="section-title">Bukti Pembayaran Terkirim!</h1>
            <p className="section-copy mx-auto">
              Bukti pembayaran Anda sedang diverifikasi oleh admin. Anda akan menerima konfirmasi
              melalui halaman riwayat tiket setelah pembayaran disetujui.
            </p>
          </div>
          <Card className="space-y-4 text-left">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-dark/50">Kode Tiket</div>
                <div className="font-bold text-dark">{ticket.kode_tiket}</div>
              </div>
              <div>
                <div className="text-dark/50">Total Pembayaran</div>
                <div className="font-bold text-saffron">{formatRupiah(ticket.total_harga)}</div>
              </div>
            </div>
          </Card>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/riwayat">
              <Button size="lg">Lihat Riwayat Tiket</Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="ghost">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            Pembayaran
          </p>
          <h1 className="section-title">Selesaikan Pembayaran Anda</h1>
          <p className="section-copy">
            Lakukan pembayaran sesuai metode yang Anda pilih, kemudian unggah bukti pembayaran.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Payment Instructions */}
            <Card className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-dark">
                  {isTransfer ? 'Transfer Bank' : 'Pembayaran QRIS'}
                </h2>
              </div>

              {isTransfer ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-cream p-6 space-y-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-dark/40">Bank Tujuan</div>
                      <div className="mt-1 text-lg font-bold text-dark">{bankInfo.bank}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-dark/40">Nomor Rekening</div>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="font-mono text-2xl font-bold tracking-wider text-saffron">{bankInfo.noRek}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('1234567890', 'norek')}
                          className="rounded-lg bg-saffron/10 px-2 py-1 text-xs font-bold text-saffron hover:bg-saffron/20"
                        >
                          {copied === 'norek' ? '✓ Tersalin' : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-dark/40">Atas Nama</div>
                      <div className="mt-1 font-semibold text-dark">{bankInfo.atasNama}</div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-cultureYellow/30 bg-cultureYellow/10 p-4 text-sm text-dark">
                    ⚠️ Transfer <strong>tepat sejumlah {formatRupiah(ticket.total_harga)}</strong> agar pembayaran dapat diverifikasi dengan cepat.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4 rounded-2xl bg-cream p-8">
                    <div className="text-sm font-bold uppercase tracking-widest text-dark/40">Scan QR Code</div>
                    {/* QRIS QR Code placeholder */}
                    <div className="rounded-2xl bg-white p-4 shadow-lg">
                      <div className="grid grid-cols-10 gap-[2px]">
                        {Array.from({ length: 100 }, (_, i) => {
                          const seed = ticket.kode_tiket
                          const charCode = seed.charCodeAt(i % seed.length)
                          const filled = ((charCode + i * 7) % 3) !== 0
                          return (
                            <div
                              key={i}
                              className={`h-4 w-4 rounded-[1px] ${filled ? 'bg-dark' : 'bg-gray-100'}`}
                            />
                          )
                        })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-dark">SeniLokal - QRIS</div>
                      <div className="text-xs text-dark/50">Gunakan aplikasi e-wallet atau mobile banking</div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-cultureYellow/30 bg-cultureYellow/10 p-4 text-sm text-dark">
                    ⚠️ Bayar <strong>tepat sejumlah {formatRupiah(ticket.total_harga)}</strong> melalui scan QRIS di atas.
                  </div>
                </div>
              )}
            </Card>

            {/* Upload Bukti Bayar */}
            <Card className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                  <Upload className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-dark">Upload Bukti Pembayaran</h2>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  disabled={uploading}
                />
                <div
                  className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                    buktiUrl
                      ? 'border-cultureGreen bg-cultureGreen/5'
                      : uploading
                        ? 'border-dark/20 bg-dark/5 opacity-50'
                        : 'border-dark/15 bg-cream hover:border-saffron hover:bg-saffron/5'
                  }`}
                >
                  <Upload className="h-8 w-8 text-dark/30" />
                  <div className="text-sm font-semibold text-dark/60">
                    {uploading
                      ? 'Mengunggah...'
                      : buktiUrl
                        ? '✅ Bukti berhasil diunggah — Klik untuk ganti'
                        : 'Klik atau seret file bukti pembayaran di sini'}
                  </div>
                  <div className="text-[10px] text-dark/40">Format: JPG, PNG, WEBP · Maks 5MB</div>
                </div>
              </div>

              {buktiUrl && (
                <div className="overflow-hidden rounded-2xl border border-dark/10">
                  <img src={buktiUrl} alt="Bukti Bayar" className="max-h-[300px] w-full object-contain bg-gray-50" />
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                  {error}
                </div>
              )}

              <Button
                size="lg"
                fullWidth
                loading={uploading}
                onClick={handleSubmitProof}
                disabled={!buktiUrl}
              >
                Kirim Bukti Pembayaran
              </Button>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="space-y-5">
              <h2 className="font-display text-xl font-bold text-dark">Info Pesanan</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-dark/50">Kode Tiket</div>
                  <div className="font-bold text-dark">{ticket.kode_tiket}</div>
                </div>
                <div>
                  <div className="text-dark/50">Event</div>
                  <div className="font-bold text-dark">{ticket.event?.judul ?? '-'}</div>
                </div>
                <div>
                  <div className="text-dark/50">Tanggal</div>
                  <div className="font-semibold text-dark">
                    {ticket.event?.tanggal ? formatTanggalJam(ticket.event.tanggal) : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-dark/50">Lokasi</div>
                  <div className="font-semibold text-dark">{ticket.event?.lokasi ?? '-'}</div>
                </div>
                <div>
                  <div className="text-dark/50">Jumlah</div>
                  <div className="font-semibold text-dark">{ticket.jumlah} tiket</div>
                </div>
                <div className="border-t border-dark/10 pt-3">
                  <div className="text-dark/50">Total Pembayaran</div>
                  <div className="font-display text-2xl font-bold text-saffron">
                    {formatRupiah(ticket.total_harga)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
