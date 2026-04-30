import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import type { Event, Tiket } from '../types'
import { formatRupiah, formatTanggalJam } from '../utils/helpers'

interface BookingLocationState {
  event?: Event
  qty?: number
}

interface BookingResponse {
  success: boolean
  message?: string
  tiket: {
    id: number
    kode_tiket: string
    event: {
      id: number
      judul: string
      tanggal: string
      lokasi: string
    }
    jumlah: number
    total_harga: number
    metode_bayar: Tiket['metode_bayar']
    status_bayar: Tiket['status_bayar']
  }
}

export default function BookingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const state = (location.state as BookingLocationState | null) ?? {}
  const event = state.event
  const qty = state.qty ?? 1

  const [namaPemesan, setNamaPemesan] = useState(user?.nama ?? '')
  const [telepon, setTelepon] = useState(user?.telepon ?? '')
  const [catatan, setCatatan] = useState('')
  const [metodeBayar, setMetodeBayar] = useState<Tiket['metode_bayar']>('transfer_bank')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setNamaPemesan(user.nama)
      setTelepon(user.telepon ?? '')
    }
  }, [user])

  const total = useMemo(() => (event ? event.harga * qty : 0), [event, qty])

  if (!event) {
    return <Navigate to="/events" replace />
  }

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiRequest<BookingResponse>('/tiket/beli', {
        method: 'POST',
        body: JSON.stringify({
          event_id: event.id,
          jumlah: qty,
          metode_bayar: metodeBayar,
          nama_pemesan: namaPemesan,
          email_pemesan: user?.email,
          telepon_pemesan: telepon,
          catatan,
        }),
      })

      navigate('/tiket', {
        replace: true,
        state: {
          ticket: {
            id: response.tiket.id,
            kode_tiket: response.tiket.kode_tiket,
            event_id: event.id,
            jumlah: response.tiket.jumlah,
            total_harga: response.tiket.total_harga,
            metode_bayar: response.tiket.metode_bayar,
            status_bayar: response.tiket.status_bayar,
            nama_pemesan: namaPemesan,
            email_pemesan: user?.email ?? '',
            telepon_pemesan: telepon,
            catatan,
            created_at: new Date().toISOString(),
            event: {
              id: event.id,
              judul: event.judul,
              tanggal: event.tanggal,
              lokasi: event.lokasi,
              kota: event.kota,
              emoji: event.emoji,
            },
          } satisfies Tiket,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page py-14">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-dark/70 transition hover:text-saffron"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke detail event
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h1 className="section-title">Pemesanan Tiket</h1>
            <p className="section-copy mt-3">
              Pastikan data pemesan benar sebelum mengonfirmasi transaksi.
            </p>
          </div>

          <Card padding="none" className="overflow-hidden">
            <div
              className="flex items-center justify-center px-6 py-8 text-6xl"
              style={{ background: event.gradient_style || 'linear-gradient(135deg,#4A3218,#C8792A)' }}
            >
              {event.emoji}
            </div>
            <div className="space-y-3 p-6">
              <div className="font-display text-2xl font-bold text-dark">{event.judul}</div>
              <div className="text-sm text-dark/70">{formatTanggalJam(event.tanggal)}</div>
              <div className="text-sm text-dark/70">{event.lokasi}</div>
            </div>
          </Card>

          <Card className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-dark">Data Pemesan</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nama Pemesan"
                value={namaPemesan}
                onChange={(event) => setNamaPemesan(event.target.value)}
                required
              />
              <Input label="Email Pemesan" value={user?.email ?? ''} readOnly />
              <Input
                label="No. Telepon"
                value={telepon}
                onChange={(event) => setTelepon(event.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label="Catatan"
                  textarea
                  placeholder="Tambahkan catatan bila diperlukan"
                  value={catatan}
                  onChange={(event) => setCatatan(event.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-dark">Metode Pembayaran</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: 'transfer_bank', label: '🏦 Transfer Bank' },
                { value: 'dompet_digital', label: '💳 Dompet Digital' },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`cursor-pointer rounded-[24px] border p-5 transition ${
                    metodeBayar === method.value
                      ? 'border-saffron bg-saffron/10'
                      : 'border-dark/10 bg-white hover:border-saffron/30'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={metodeBayar === method.value}
                    onChange={() => setMetodeBayar(method.value as Tiket['metode_bayar'])}
                  />
                  <div className="font-semibold text-dark">{method.label}</div>
                </label>
              ))}
            </div>
          </Card>

          {error ? (
            <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" loading={loading}>
              Konfirmasi Pemesanan
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Batal
            </Button>
          </div>
        </form>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Card className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-dark">Ringkasan Order</h2>
            <div className="space-y-3 text-sm text-dark/70">
              <div className="flex items-center justify-between">
                <span>{formatRupiah(event.harga)} × {qty}</span>
                <span>{formatRupiah(event.harga * qty)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-dark/10 pt-3 text-base font-bold text-dark">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
