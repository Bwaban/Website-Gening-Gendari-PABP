import { useEffect, useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard'
import EventFilter, { type EventFilterValues } from '../components/EventFilter'
import Spinner from '../components/ui/Spinner'
import { useEvents } from '../hooks/useEvents'

const initialFiltersFromParams = (params: URLSearchParams): EventFilterValues => ({
  search: params.get('search') ?? '',
  kategori: params.get('kategori') ?? 'Semua',
  kota: params.get('kota') ?? 'Semua',
  tanggalMulai: params.get('tanggal_mulai') ?? '',
  tanggalAkhir: params.get('tanggal_akhir') ?? '',
})

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<EventFilterValues>(() =>
    initialFiltersFromParams(searchParams)
  )

  useEffect(() => {
    setFilters(initialFiltersFromParams(searchParams))
  }, [searchParams])

  useEffect(() => {
    const nextParams = new URLSearchParams()

    if (filters.search) nextParams.set('search', filters.search)
    if (filters.kategori && filters.kategori !== 'Semua') nextParams.set('kategori', filters.kategori)
    if (filters.kota && filters.kota !== 'Semua') nextParams.set('kota', filters.kota)
    if (filters.tanggalMulai) nextParams.set('tanggal_mulai', filters.tanggalMulai)
    if (filters.tanggalAkhir) nextParams.set('tanggal_akhir', filters.tanggalAkhir)

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [filters, searchParams, setSearchParams])

  const { events, loading, error } = useEvents({
    search: filters.search,
    kategori: filters.kategori,
    kota: filters.kota,
    tanggalMulai: filters.tanggalMulai,
    tanggalAkhir: filters.tanggalAkhir,
  })

  const skeletons = useMemo(() => Array.from({ length: 3 }), [])

  return (
    <div className="py-14">
      <div className="container-page space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            Semua Pertunjukan
          </p>
          <h1 className="section-title">Semua Pertunjukan</h1>
          <p className="section-copy">Menampilkan {events.length} pertunjukan.</p>
        </div>

        <EventFilter
          value={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters({
              search: '',
              kategori: 'Semua',
              kota: 'Semua',
              tanggalMulai: '',
              tanggalAkhir: '',
            })
          }
        />

        {error ? (
          <div className="rounded-[28px] border border-cultureRed/20 bg-cultureRed/5 p-6 text-cultureRed">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {skeletons.map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[28px] border border-dark/10 bg-white shadow-soft"
              >
                <div className="h-48 animate-pulse bg-dark/10" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-28 animate-pulse rounded-full bg-dark/10" />
                  <div className="h-8 animate-pulse rounded-full bg-dark/10" />
                  <div className="h-5 animate-pulse rounded-full bg-dark/10" />
                  <div className="h-5 w-2/3 animate-pulse rounded-full bg-dark/10" />
                  <div className="h-11 animate-pulse rounded-full bg-dark/10" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dark/10 bg-white px-8 py-16 text-center shadow-soft">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-saffron/10 text-saffron">
              <SearchX className="h-10 w-10" />
            </div>
            <h2 className="font-display text-3xl font-bold text-dark">
              Tidak ada pertunjukan ditemukan
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-dark/70">
              Coba ubah kata kunci pencarian atau reset filter untuk melihat
              pilihan pertunjukan lainnya.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
