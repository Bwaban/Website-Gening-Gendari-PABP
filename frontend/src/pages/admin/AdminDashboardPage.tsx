import { CalendarRange, CheckCircle2, Ticket, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { useEvents } from '../../hooks/useEvents'
import { formatTanggalJam, sisaKuota } from '../../utils/helpers'

const cardTheme = [
  {
    title: 'Total Event',
    icon: CalendarRange,
    className: 'from-[#1F2A44] to-[#354A7A]',
  },
  {
    title: 'Tiket Terjual',
    icon: Ticket,
    className: 'from-saffron to-gold',
  },
  {
    title: 'Event Tersedia',
    icon: CheckCircle2,
    className: 'from-cultureGreen to-[#49A46B]',
  },
  {
    title: 'Event Habis',
    icon: XCircle,
    className: 'from-cultureRed to-[#D85C4B]',
  },
]

export default function AdminDashboardPage() {
  const { rawEvents, loading, error } = useEvents()

  const totalEvents = rawEvents.length
  const totalSold = rawEvents.reduce((sum, event) => sum + event.tiket_terjual, 0)
  const totalAvailable = rawEvents.filter((event) => event.status === 'tersedia').length
  const totalSoldOut = rawEvents.filter((event) => event.status === 'habis').length

  const values = [totalEvents, totalSold, totalAvailable, totalSoldOut]

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-cultureRed/20 bg-cultureRed/5 p-5 text-cultureRed">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cardTheme.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="overflow-hidden p-0">
              <div className={`bg-gradient-to-br ${card.className} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.22em] text-white/75">
                      {card.title}
                    </div>
                    <div className="mt-3 font-display text-4xl font-bold">{values[index]}</div>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-0">
        <div className="flex flex-col gap-4 border-b border-dark/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-dark">Ringkasan Event</h2>
            <p className="text-sm text-dark/65">Lima pertunjukan teratas dari data backend</p>
          </div>
          <Link className="text-sm font-semibold text-saffron" to="/admin/events">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-dark text-sm uppercase tracking-[0.16em] text-cream/65">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Judul</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Kota</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sisa Kuota</th>
              </tr>
            </thead>
            <tbody>
              {rawEvents.slice(0, 5).map((event, index) => (
                <tr key={event.id} className="border-t border-dark/10">
                  <td className="px-6 py-5 text-dark/70">{index + 1}</td>
                  <td className="px-6 py-5 font-semibold text-dark">{event.judul}</td>
                  <td className="px-6 py-5 text-dark/70">{event.kategori}</td>
                  <td className="px-6 py-5 text-dark/70">{event.kota}</td>
                  <td className="px-6 py-5 text-sm text-dark/70">
                    {formatTanggalJam(event.tanggal)}
                  </td>
                  <td className="px-6 py-5 capitalize text-dark">{event.status}</td>
                  <td className="px-6 py-5 font-semibold text-dark">
                    {sisaKuota(event.kuota, event.tiket_terjual)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
