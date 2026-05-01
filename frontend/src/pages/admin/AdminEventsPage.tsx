import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { useEvents } from '../../hooks/useEvents'
import type { Event } from '../../types'
import { formatRupiah, formatTanggalJam } from '../../utils/helpers'

const PER_PAGE = 8

export default function AdminEventsPage() {
  const { rawEvents, loading, error, refetch } = useEvents()
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const filteredEvents = useMemo(
    () =>
      rawEvents.filter((event) =>
        [event.judul, event.kategori, event.kota, event.lokasi]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, rawEvents]
  )

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PER_PAGE))
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  )

  const handleDelete = async () => {
    if (!deletingEvent) return

    try {
      setDeleteLoading(true)
      setActionError('')
      await apiRequest<{ success: boolean; message?: string }>(`/events/${deletingEvent.id}`, {
        method: 'DELETE',
      })
      setDeletingEvent(null)
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal menghapus event')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold text-dark">Manajemen Pertunjukan</h2>
          <p className="text-dark/65">Kelola seluruh pertunjukan yang tampil di aplikasi.</p>
        </div>
        <Link to="/admin/events/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Tambah Pertunjukan</Button>
        </Link>
      </div>

      <Card className="space-y-5">
        <Input
          label="Cari Pertunjukan"
          placeholder="Cari judul, kategori, kota, atau lokasi..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setCurrentPage(1)
          }}
        />

        {error || actionError ? (
          <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
            {actionError || error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-dark text-sm uppercase tracking-[0.16em] text-cream/65">
                  <tr>
                    <th className="px-4 py-4">No</th>
                    <th className="px-4 py-4">Judul</th>
                    <th className="px-4 py-4">Kategori</th>
                    <th className="px-4 py-4">Kota</th>
                    <th className="px-4 py-4">Tanggal</th>
                    <th className="px-4 py-4">Harga</th>
                    <th className="px-4 py-4">Kuota</th>
                    <th className="px-4 py-4">Terjual</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event, index) => (
                    <tr key={event.id} className="border-t border-dark/10">
                      <td className="px-4 py-4 text-dark/70">
                        {(currentPage - 1) * PER_PAGE + index + 1}
                      </td>
                      <td className="px-4 py-4 font-semibold text-dark">{event.judul}</td>
                      <td className="px-4 py-4 text-dark/70">{event.kategori}</td>
                      <td className="px-4 py-4 text-dark/70">{event.kota}</td>
                      <td className="px-4 py-4 text-sm text-dark/70">
                        {formatTanggalJam(event.tanggal)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-dark">
                        {formatRupiah(event.harga)}
                      </td>
                      <td className="px-4 py-4 text-dark/70">{event.kuota}</td>
                      <td className="px-4 py-4 text-dark/70">{event.tiket_terjual}</td>
                      <td className="px-4 py-4 capitalize text-dark">{event.status}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link to={`/admin/events/edit/${event.id}`}>
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<Pencil className="h-4 w-4" />}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Trash2 className="h-4 w-4" />}
                            onClick={() => setDeletingEvent(event)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-sm text-dark/65">
                Menampilkan {paginatedEvents.length} dari {filteredEvents.length} event
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Sebelumnya
                </Button>
                <span className="rounded-full bg-dark/5 px-4 py-2 text-sm font-semibold text-dark">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        title="Hapus Pertunjukan?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingEvent(null)}>
              Batal
            </Button>
            <Button variant="danger" loading={deleteLoading} onClick={() => void handleDelete()}>
              Ya, Hapus
            </Button>
          </>
        }
      >
        <p className="rounded-[24px] bg-cream p-5 text-dark/80">
          Pertunjukan <strong>{deletingEvent?.judul}</strong> akan dihapus dari database.
        </p>
      </Modal>
    </div>
  )
}
