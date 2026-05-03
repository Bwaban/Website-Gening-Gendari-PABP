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
    <article className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[#ead7bc] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-panel">
      <div
        className="event-image-overlay relative flex h-48 w-full items-center justify-center overflow-hidden transition duration-500 group-hover:scale-105"
        style={{ background: event.gradient_style || theme.gradient }}
      >
        <span className="relative z-10 text-6xl opacity-70 drop-shadow-xl transition duration-500 group-hover:scale-110 group-hover:opacity-100">{event.emoji || theme.emoji}</span>
      </div>

      <div className="flex flex-1 flex-col p-6 z-20 bg-white">
        <div className="mb-4 space-y-2">
          <span 
            className="block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: theme.color || '#A55E1D' }}
          >
            {event.kategori}
          </span>

          <h3 className="font-display text-[1.4rem] font-bold leading-tight text-dark line-clamp-2" title={event.judul}>
            {event.judul}
          </h3>
        </div>

        <div className="mb-6 space-y-3 text-[0.85rem] text-dark/75">
          <div className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-saffron" />
            <span className="leading-snug">{formatTanggalJam(event.tanggal)}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-pink" />
            <span className="leading-snug line-clamp-2">
              {event.lokasi}, {event.kota}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#efe1cb] pt-4">
          <div className="flex flex-col items-start gap-1.5">
            <Badge type="status" value={badgeLabel} className="capitalize text-[10px] px-2 py-0.5" />
            <div className="text-xl font-bold text-dark">{formatRupiah(event.harga)}</div>
          </div>
          <Link to={`/events/${event.id}`} className="shrink-0">
            <Button size="sm" className="rounded-xl px-5">Detail</Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
