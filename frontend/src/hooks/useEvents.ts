import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/client'
import type { Event, EventFilters } from '../types'
import { toDateOnly } from '../utils/helpers'

interface EventsResponse {
  success: boolean
  events: Event[]
}

const matchesSearch = (event: Event, search: string) => {
  if (!search) return true
  const term = search.toLowerCase()
  return [event.judul, event.deskripsi, event.kota, event.lokasi, event.kategori]
    .join(' ')
    .toLowerCase()
    .includes(term)
}

const matchesDateRange = (event: Event, start?: string, end?: string) => {
  const eventDate = toDateOnly(event.tanggal)
  if (start && eventDate < start) return false
  if (end && eventDate > end) return false
  return true
}

export function useEvents(filters: EventFilters = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.kategori && filters.kategori !== 'Semua') {
        params.set('kategori', filters.kategori)
      }

      if (filters.kota && filters.kota !== 'Semua') {
        params.set('kota', filters.kota)
      }

      const query = params.toString()
      const response = await apiRequest<EventsResponse>(`/events${query ? `?${query}` : ''}`)
      setEvents(response.events ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat pertunjukan')
    } finally {
      setLoading(false)
    }
  }, [filters.kategori, filters.kota])

  useEffect(() => {
    void fetchEvents()
  }, [fetchEvents, refreshKey])

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          matchesSearch(event, filters.search ?? '') &&
          matchesDateRange(event, filters.tanggalMulai, filters.tanggalAkhir)
      ),
    [events, filters.search, filters.tanggalAkhir, filters.tanggalMulai]
  )

  const refetch = () => setRefreshKey((prev) => prev + 1)

  return {
    events: filteredEvents,
    rawEvents: events,
    loading,
    error,
    refetch,
  }
}
