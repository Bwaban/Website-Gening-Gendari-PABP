import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Event } from '../types'
import {
  formatRupiah,
  formatTanggalJam,
  persenTerjual,
  sisaKuota,
} from '../utils/helpers'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Card from './ui/Card'

export default function EventCard({ event }: { event: Event }) {
  const soldPercentage = persenTerjual(event.kuota, event.tiket_terjual)
  const remainingSeats = sisaKuota(event.kuota, event.tiket_terjual)

  return (
    <Card padding="none" className="overflow-hidden">
      <div
        className="flex h-48 items-center justify-center"
        style={{ background: event.gradient_style || 'linear-gradient(135deg,#4A3218,#C8792A)' }}
      >
        <span className="text-6xl drop-shadow-lg">{event.emoji || '🎭'}</span>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge type="category" value={event.kategori} />
          <Badge type="status" value={event.status} />
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-2xl font-bold leading-tight text-dark">
            {event.judul}
          </h3>
          <div className="space-y-2 text-sm text-dark/70">
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
              <span>{formatTanggalJam(event.tanggal)}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
              <span>
                {event.lokasi} · {event.kota}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-dark/70">
            <span>Sisa kuota</span>
            <span className="font-semibold text-dark">{remainingSeats} tiket</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-dark/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-saffron to-gold"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm text-dark/60">Mulai dari</div>
            <div className="text-xl font-bold text-dark">{formatRupiah(event.harga)}</div>
          </div>
          <Link to={`/events/${event.id}`}>
            <Button>Lihat Detail</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
