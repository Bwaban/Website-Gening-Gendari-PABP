import { BadgeCheck, CalendarDays, Info, MapPin, Minus, Music4, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../api/client'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'
import type { Event } from '../types'
import { formatRupiah, formatTanggalJam, sisaKuota } from '../utils/helpers'

interface EventDetailResponse {
  success: boolean
  event: Event
}

type TabKey = 'deskripsi' | 'informasi'

export default function EventDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('deskripsi')
  const [qty, setQty] = useState(1)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiRequest<EventDetailResponse>(`/events/${id}`)
        setEvent(response.event)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat detail event')
      } finally {
        setLoading(false)
      }
    }

    void loadEvent()
  }, [id])

  const remainingSeats = useMemo(
    () => (event ? sisaKuota(event.kuota, event.tiket_terjual) : 0),
    [event]
  )

  const total = useMemo(() => (event ? event.harga * qty : 0), [event, qty])

  const handleBooking = () => {
    if (!event) return

    if (!isAuthenticated) {
      setLoginModalOpen(true)
      return
    }

    navigate('/booking', {
      state: {
        event,
        qty,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container-page py-14">
        <div className="rounded-[28px] border border-cultureRed/20 bg-cultureRed/5 p-6 text-cultureRed">
          {error ?? 'Event tidak ditemukan'}
        </div>
      </div>
    )
  }

  const soldOut = event.status === 'habis' || remainingSeats <= 0

  return (
    <div className="py-14">
      <div className="container-page grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <div className="space-y-8">
          <Card padding="none" className="overflow-hidden">
            <div
              className="relative flex min-h-[400px] items-center justify-center overflow-hidden"
              style={{ background: event.gradient_style || 'linear-gradient(135deg,#4A3218,#C8792A)' }}
            >
              {event.gambar_url ? (
                <img 
                  src={event.gambar_url} 
                  alt={event.judul}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div>
                  <div className="mb-6 text-8xl text-center">{event.emoji}</div>
                  <div className="text-sm uppercase tracking-[0.4em] text-white/80 text-center">
                    SeniLokal Featured
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 p-8">
              <div className="flex flex-wrap gap-2">
                <Badge type="category" value={event.kategori} />
                <Badge type="status" value={event.status} />
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-bold leading-tight text-dark sm:text-5xl">
                  {event.judul}
                </h1>
                <div className="grid gap-3 text-sm text-dark/70 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
                    <span>{formatTanggalJam(event.tanggal)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
                    <span>{event.lokasi}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 rounded-full bg-dark/5 p-1">
                {[
                  { key: 'deskripsi', label: 'Deskripsi' },
                  { key: 'informasi', label: 'Informasi' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as TabKey)}
                    className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? 'bg-white text-dark shadow-sm'
                        : 'text-dark/65 hover:text-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'deskripsi' ? (
                <div className="whitespace-pre-line font-body text-base leading-relaxed text-dark/75">
                  {event.deskripsi}
                </div>
              ) : (
                <div className="grid gap-6 rounded-[28px] bg-cream p-8 text-sm text-dark/80 sm:grid-cols-2">
                  <div className="flex items-center gap-4 border-b border-dark/5 pb-4 sm:border-none sm:pb-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                      <Music4 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Penyelenggara</div>
                      <div className="font-semibold text-dark">SeniLokal & BudayaRI</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-dark/5 pb-4 sm:border-none sm:pb-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Tanggal & Waktu</div>
                      <div className="font-semibold text-dark">{formatTanggalJam(event.tanggal)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-dark/5 pb-4 sm:border-none sm:pb-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Kota & Lokasi</div>
                      <div className="font-semibold text-dark">{event.kota}, {event.lokasi}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-dark/5 pb-4 sm:border-none sm:pb-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Sisa Kuota</div>
                      <div className="font-semibold text-dark">{remainingSeats} dari {event.kuota} Tiket Tersedia</div>
                    </div>
                  </div>
                  <div className="col-span-full mt-2 rounded-2xl bg-white/50 p-4 text-xs italic text-dark/50">
                    * Harap tunjukkan e-tiket yang dikirimkan ke email Anda saat memasuki lokasi acara.
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="xl:sticky xl:top-28 xl:self-start">
          <Card className="space-y-6">
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-dark/50">
                Harga per tiket
              </div>
              <div className="mt-2 font-display text-4xl font-bold text-dark">
                {formatRupiah(event.harga)}
              </div>
              <div className="text-sm text-dark/60">per orang</div>
            </div>

            <div className="rounded-[28px] bg-cream p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-semibold text-dark">Jumlah tiket</div>
                <div className="text-sm text-dark/60">Maksimal {remainingSeats}</div>
              </div>
              <div className="flex items-center justify-between rounded-full border border-dark/10 bg-white p-2">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-dark/5 text-dark transition hover:bg-dark/10"
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-bold text-dark">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.min(remainingSeats, prev + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-dark/5 text-dark transition hover:bg-dark/10"
                  disabled={qty >= remainingSeats}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-[28px] bg-dark/5 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark/60">Total</span>
                <span className="text-2xl font-bold text-dark">{formatRupiah(total)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-dark/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron to-gold"
                  style={{
                    width: `${Math.min(100, Math.round((event.tiket_terjual / event.kuota) * 100))}%`,
                  }}
                />
              </div>
              <div className="text-sm text-dark/70">
                {remainingSeats} tiket tersisa dari {event.kuota}
              </div>
            </div>

            {event.status === 'terbatas' ? (
              <div className="rounded-[24px] border border-cultureYellow/30 bg-cultureYellow/10 p-4 text-sm text-dark">
                Segera pesan, tiket hampir habis!
              </div>
            ) : null}

            <Button
              size="lg"
              fullWidth
              disabled={soldOut}
              onClick={handleBooking}
            >
              {soldOut ? 'Tiket Habis' : 'Pesan Tiket'}
            </Button>

            <Link to="/events">
              <Button variant="ghost" fullWidth>
                Kembali ke Daftar Event
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        title="Masuk Diperlukan"
        footer={
          <>
            <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() =>
                navigate('/login', {
                  state: { from: location.pathname },
                })
              }
            >
              Masuk Sekarang
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-[24px] bg-cream p-5 text-dark/80">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
          <p>Kamu perlu masuk terlebih dahulu untuk memesan tiket.</p>
        </div>
      </Modal>
    </div>
  )
}
