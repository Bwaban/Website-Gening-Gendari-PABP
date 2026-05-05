import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import type { Tiket } from '../types'
import {
  formatRupiah,
  formatTanggalJam,
  labelMetodeBayar,
  mapTicketRow,
} from '../utils/helpers'

interface RiwayatResponse {
  success: boolean
  tikets: Array<Record<string, unknown>>
}

interface DetailResponse {
  success: boolean
  tiket: Record<string, unknown>
}

export default function RiwayatTiketPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Tiket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Tiket | null>(null)
  const [ticketToCancel, setTicketToCancel] = useState<Tiket | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiRequest<RiwayatResponse>('/tiket/riwayat')
      setTickets((response.tikets ?? []).map(mapTicketRow))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil riwayat tiket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  const empty = useMemo(() => !loading && tickets.length === 0, [loading, tickets.length])

  const openDetail = async (ticket: Tiket) => {
    try {
      const response = await apiRequest<DetailResponse>(`/tiket/${ticket.kode_tiket}`)
      setSelectedTicket(mapTicketRow(response.tiket))
    } catch {
      setSelectedTicket(ticket)
    }
  }

  const handleCancel = async () => {
    if (!ticketToCancel) return

    try {
      setCancelLoading(true)
      await apiRequest<{ success: boolean; message?: string }>(
        `/tiket/${ticketToCancel.kode_tiket}/batalkan`,
        { method: 'POST' }
      )
      setTicketToCancel(null)
      await loadTickets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membatalkan tiket')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleCetakPdf = (ticket: Tiket) => {
    navigate('/tiket', { state: { ticket } })
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'lunas':
        return 'bg-cultureGreen/15 text-cultureGreen'
      case 'menunggu':
        return 'bg-cultureYellow/15 text-dark'
      case 'dibatalkan':
        return 'bg-cultureRed/10 text-cultureRed'
      default:
        return 'bg-dark/8 text-dark'
    }
  }

  return (
    <div className="container-page py-14">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            Riwayat Tiket
          </p>
          <h1 className="section-title">Semua pemesananmu tersimpan di sini</h1>
        </div>
        <Link to="/events">
          <Button>Lihat Event Lagi</Button>
        </Link>
      </div>

      {error ? (
        <div className="mb-6 rounded-[24px] border border-cultureRed/20 bg-cultureRed/5 p-4 text-sm text-cultureRed">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : empty ? (
        <Card className="py-14 text-center">
          <div className="space-y-3">
            <div className="text-5xl">🎟️</div>
            <h2 className="font-display text-3xl font-bold text-dark">
              Kamu belum pernah memesan tiket
            </h2>
            <p className="font-body text-dark/70">
              Jelajahi pertunjukan yang tersedia dan mulai pesan tiket pertama kamu.
            </p>
          </div>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-dark text-sm uppercase tracking-[0.18em] text-cream/70">
                <tr>
                  <th className="px-6 py-4">Kode</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Jumlah</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.kode_tiket} className="border-t border-dark/10">
                    <td className="px-6 py-5 font-semibold text-dark">{ticket.kode_tiket}</td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-dark">{ticket.event?.judul ?? '-'}</div>
                      <div className="text-sm text-dark/60">{ticket.event?.lokasi ?? '-'}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/70">
                      {ticket.event?.tanggal ? formatTanggalJam(ticket.event.tanggal) : '-'}
                    </td>
                    <td className="px-6 py-5 text-dark">{ticket.jumlah}</td>
                    <td className="px-6 py-5 font-semibold text-dark">
                      {formatRupiah(ticket.total_harga)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle(ticket.status_bayar)}`}>
                        {ticket.status_bayar}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => void openDetail(ticket)}
                        >
                          Detail
                        </Button>
                        {ticket.status_bayar === 'lunas' && (
                          <Button
                            size="sm"
                            onClick={() => handleCetakPdf(ticket)}
                          >
                            Cetak Tiket
                          </Button>
                        )}
                        {ticket.status_bayar === 'menunggu' ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setTicketToCancel(ticket)}
                          >
                            Batalkan
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title="Detail Tiket"
        size="lg"
      >
        {selectedTicket ? (
          <div className="space-y-5">
            <div className="grid gap-5 rounded-[28px] bg-cream p-6 text-sm text-dark/80 md:grid-cols-2">
              <div>
                <div className="text-dark/50">Kode Tiket</div>
                <div className="font-semibold text-dark">{selectedTicket.kode_tiket}</div>
              </div>
              <div>
                <div className="text-dark/50">Nama Event</div>
                <div className="font-semibold text-dark">{selectedTicket.event?.judul ?? '-'}</div>
              </div>
              <div>
                <div className="text-dark/50">Tanggal</div>
                <div className="font-semibold text-dark">
                  {selectedTicket.event?.tanggal
                    ? formatTanggalJam(selectedTicket.event.tanggal)
                    : '-'}
                </div>
              </div>
              <div>
                <div className="text-dark/50">Lokasi</div>
                <div className="font-semibold text-dark">{selectedTicket.event?.lokasi ?? '-'}</div>
              </div>
              <div>
                <div className="text-dark/50">Jumlah Tiket</div>
                <div className="font-semibold text-dark">{selectedTicket.jumlah}</div>
              </div>
              <div>
                <div className="text-dark/50">Total Bayar</div>
                <div className="font-semibold text-dark">
                  {formatRupiah(selectedTicket.total_harga)}
                </div>
              </div>
              <div>
                <div className="text-dark/50">Metode Bayar</div>
                <div className="font-semibold text-dark">
                  {labelMetodeBayar(selectedTicket.metode_bayar)}
                </div>
              </div>
              <div>
                <div className="text-dark/50">Status</div>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle(selectedTicket.status_bayar)}`}>
                  {selectedTicket.status_bayar}
                </span>
              </div>
            </div>

            {selectedTicket.status_bayar === 'menunggu' && (
              <div className="rounded-2xl border border-cultureYellow/30 bg-cultureYellow/10 p-4 text-sm text-dark">
                ⏳ Pembayaran sedang menunggu verifikasi admin. Tiket dapat dicetak setelah pembayaran disetujui.
              </div>
            )}

            {selectedTicket.status_bayar === 'lunas' && (
              <div className="rounded-2xl border border-cultureGreen/30 bg-cultureGreen/10 p-4 text-sm text-dark">
                ✅ Pembayaran telah diverifikasi. Anda dapat mencetak tiket.
              </div>
            )}

            {selectedTicket.status_bayar === 'lunas' && (
              <Button
                fullWidth
                onClick={() => {
                  setSelectedTicket(null)
                  handleCetakPdf(selectedTicket)
                }}
              >
                Cetak Tiket PDF
              </Button>
            )}
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={Boolean(ticketToCancel)}
        onClose={() => setTicketToCancel(null)}
        title="Batalkan Tiket?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTicketToCancel(null)}>
              Batal
            </Button>
            <Button variant="danger" onClick={() => void handleCancel()} loading={cancelLoading}>
              Ya, Batalkan
            </Button>
          </>
        }
      >
        <p className="rounded-[24px] bg-cream p-5 text-dark/80">
          Tiket dengan kode <strong>{ticketToCancel?.kode_tiket}</strong> akan dibatalkan
          dan kuota event dikembalikan.
        </p>
      </Modal>
    </div>
  )
}
