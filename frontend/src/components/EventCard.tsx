import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Event } from '../types'
import { formatRupiah, formatTanggalJam, getEventTheme } from '../utils/helpers'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function EventCard({ event }: { event: Event }) {
  const theme = getEventTheme(event.kategori)
  const badgeLabel =
    event.status === 'tersedia' ? 'tersedia' : event.status === 'terbatas' ? 'terbatas' : 'habis'

  return (
    <article className="overflow-hidden rounded-[12px] border border-[#ead7bc] bg-white shadow-panel transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-soft">
      <div
        className="event-image-overlay flex h-40 items-center justify-center"
        style={{ background: event.gradient_style || theme.gradient }}
      >
        <span className="text-6xl opacity-60 drop-shadow-lg">{event.emoji || theme.emoji}</span>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-3">
          <Badge
            type="category"
            value={event.kategori}
            className="bg-transparent px-0 py-0 text-[11px] uppercase tracking-[0.14em]"
          />

          <h3 className="font-display text-[1.9rem] font-bold leading-tight text-dark">
            {event.judul}
          </h3>
        </div>

        <div className="space-y-2 text-sm text-dark/68">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
            <span>{formatTanggalJam(event.tanggal)}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink" />
            <span>
              {event.lokasi}, {event.kota}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-[#efe1cb] pt-4">
          <div>
            <Badge type="status" value={badgeLabel} className="mb-2 capitalize" />
            <div className="text-xl font-bold text-dark">{formatRupiah(event.harga)}</div>
          </div>
          <Link to={`/events/${event.id}`} className="shrink-0">
            <Button size="sm">Detail</Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
