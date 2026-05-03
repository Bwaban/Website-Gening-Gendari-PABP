import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { useEvents } from '../hooks/useEvents'
import { toDateOnly } from '../utils/helpers'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori')
  const [selectedCity, setSelectedCity] = useState('Semua Kota')
  const [selectedDate, setSelectedDate] = useState('Semua Tanggal')
  const { rawEvents, loading, error } = useEvents()

  const categories = useMemo(
    () => ['Semua Kategori', ...Array.from(new Set(rawEvents.map((event) => event.kategori)))],
    [rawEvents]
  )
  const cities = useMemo(
    () => ['Semua Kota', ...Array.from(new Set(rawEvents.map((event) => event.kota)))],
    [rawEvents]
  )
  const dates = useMemo(
    () => ['Semua Tanggal', ...Array.from(new Set(rawEvents.map((event) => toDateOnly(event.tanggal))))],
    [rawEvents]
  )

  const filteredEvents = useMemo(
    () =>
      rawEvents.filter((event) => {
        if (selectedCategory !== 'Semua Kategori' && event.kategori !== selectedCategory) return false
        if (selectedCity !== 'Semua Kota' && event.kota !== selectedCity) return false
        if (selectedDate !== 'Semua Tanggal' && toDateOnly(event.tanggal) !== selectedDate) return false
        return true
      }),
    [rawEvents, selectedCategory, selectedCity, selectedDate]
  )

  return (
    <div className="page-shell">
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1604928141064-207cea73014e?auto=format&fit=crop&w=2000&q=80" 
            alt="Pertunjukan Seni Indonesia" 
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
        </div>
        <div className="container-page relative z-10 py-24 sm:py-36">
          <div className="max-w-3xl space-y-7">
            <div className="inline-flex rounded-full border border-gold/65 bg-dark/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-sm">
              🎶 Seni Tradisional Indonesia
            </div>

            <div>
              <h1 className="font-display text-[3.1rem] font-bold leading-none sm:text-[5.5rem] text-white">
                Temukan Pesona
                <br />
                <span className="italic text-gold">Gending Gandari</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-9 text-white/90">
                Platform digital yang menghubungkan pecinta seni dengan pertunjukan Gending Gandari dan seni karawitan terbaik di seluruh Indonesia.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/events">
                <Button size="lg" className="bg-saffron hover:bg-saffron/90 text-white border-none">Jelajahi Pertunjukan</Button>
              </Link>
              <Link to="/tentang">
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Tentang Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-saffron/15 bg-white py-5">
        <div className="container-page flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Filter</div>
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-12 rounded-[10px] border border-[#e8d5b5] bg-cream px-4 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="h-12 rounded-[10px] border border-[#e8d5b5] bg-cream px-4 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            >
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <select
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-12 rounded-[10px] border border-[#e8d5b5] bg-cream px-4 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            >
              {dates.map((date) => (
                <option key={date}>{date}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-page">
          <h2 className="section-title">Semua Pertunjukan</h2>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="mt-8 rounded-[12px] border border-cultureRed/20 bg-cultureRed/5 p-6 text-cultureRed">
              {error}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {!loading && !error && !filteredEvents.length ? (
            <div className="mt-8 rounded-[12px] border border-[#ead7bc] bg-white px-6 py-12 text-center text-dark/68">
              Tidak ada pertunjukan yang cocok dengan filter yang dipilih.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
