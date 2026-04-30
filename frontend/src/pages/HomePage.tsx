import { ArrowRight, CalendarHeart, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { useEvents } from '../hooks/useEvents'

const categories = [
  { label: 'Gending Gandari', emoji: '🎼' },
  { label: 'Karawitan', emoji: '🪘' },
  { label: 'Wayang', emoji: '🎭' },
  { label: 'Tari Tradisional', emoji: '🎵' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { rawEvents, loading, error } = useEvents()

  const featuredEvents = useMemo(
    () =>
      rawEvents
        .filter((event) => ['tersedia', 'terbatas'].includes(event.status))
        .slice(0, 3),
    [rawEvents]
  )

  const totalCities = new Set(rawEvents.map((event) => event.kota)).size

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    navigate(`/events?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div>
      <section className="hero-pattern relative overflow-hidden bg-dark py-24 text-white sm:py-28">
        <div className="container-page relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">
              <CalendarHeart className="h-4 w-4" />
              Ticketing Seni Budaya Indonesia
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl font-display text-5xl font-bold leading-tight text-white sm:text-6xl">
                Temukan Pertunjukan Seni Budaya Terbaik
              </h1>
              <p className="max-w-2xl font-body text-lg leading-8 text-cream/80">
                Gending Gandari, Karawitan, Wayang, dan Tari Tradisional dalam
                satu platform yang merayakan pengalaman panggung yang hangat,
                indah, dan dekat dengan akar budaya Nusantara.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/10 p-3 backdrop-blur sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 text-dark">
                <Search className="h-5 w-5 text-saffron" />
                <input
                  type="text"
                  placeholder="Cari pertunjukan, kota, atau kategori..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-dark/40"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="sm:min-w-[180px]">
                Cari
              </Button>
            </form>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-[28px] px-5 py-4">
                <div className="text-3xl font-bold text-white">{rawEvents.length}</div>
                <div className="text-sm text-cream/70">Pertunjukan</div>
              </div>
              <div className="glass-panel rounded-[28px] px-5 py-4">
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-sm text-cream/70">Kategori</div>
              </div>
              <div className="glass-panel rounded-[28px] px-5 py-4">
                <div className="text-3xl font-bold text-white">{totalCities || 0}</div>
                <div className="text-sm text-cream/70">Kota</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-8 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative space-y-4 rounded-[36px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
              <div className="rounded-[28px] bg-gradient-to-br from-saffron via-gold to-cultureGreen p-8 text-center">
                <div className="mb-4 text-7xl">🎭</div>
                <div className="font-display text-2xl font-bold text-white">
                  Musim Pertunjukan Nusantara
                </div>
                <div className="mt-2 text-sm leading-6 text-white/80">
                  Jelajahi pertunjukan eksklusif dengan nuansa visual yang
                  terinspirasi dari panggung budaya tradisional Indonesia.
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gold">
                    <MapPin className="h-4 w-4" />
                    Kota Aktif
                  </div>
                  <div className="font-display text-3xl font-bold text-white">
                    {totalCities || 4}
                  </div>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gold">
                    <CalendarHeart className="h-4 w-4" />
                    Highlight
                  </div>
                  <div className="font-display text-3xl font-bold text-white">
                    {featuredEvents.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
              Pertunjukan Pilihan
            </p>
            <h2 className="section-title">Pilihan terbaik untuk akhir pekan budaya</h2>
            <p className="section-copy">
              Event unggulan ini diambil langsung dari API backend dan dipilih dari
              pertunjukan yang masih tersedia atau hampir habis.
            </p>
          </div>
          <Link to="/events" className="self-start sm:self-auto">
            <Button variant="secondary">
              Lihat Semua
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-cultureRed/20 bg-cultureRed/5 p-6 text-cultureRed">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <div className="mb-10 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
              Kategori Seni
            </p>
            <h2 className="section-title">Jelajahi panggung yang paling dekat dengan seleramu</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.label}
                to={`/events?kategori=${encodeURIComponent(category.label)}`}
                className="group rounded-[30px] border border-dark/10 bg-cream p-6 transition hover:-translate-y-1 hover:border-saffron/30 hover:shadow-soft"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-saffron to-gold text-3xl shadow-lg shadow-saffron/20">
                  {category.emoji}
                </div>
                <div className="font-display text-2xl font-bold text-dark">
                  {category.label}
                </div>
                <p className="mt-3 font-body text-sm leading-7 text-dark/70">
                  Kurasi pertunjukan dengan nuansa artistik yang khas dan autentik.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-saffron">
                  Lihat event
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <div className="rounded-[36px] bg-gradient-to-r from-dark via-[#2B1D12] to-dark px-8 py-12 text-center text-white shadow-soft sm:px-14">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold">
              Siap menyaksikan pertunjukan?
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Pesan tiketmu sebelum kehabisan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg leading-8 text-cream/80">
              Temukan panggung tradisi yang paling kamu tunggu, lalu lanjutkan ke
              proses pemesanan hanya dalam beberapa langkah.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/events">
                <Button size="lg">Lihat Semua Event</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
