import { useEffect, useState } from 'react'
import { apiRequest } from '../../api/client'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { formatRupiah, formatTanggalJam } from '../../utils/helpers'
import { Check, X, Search, Filter, Eye } from 'lucide-react'

interface AdminTicket {
  id: number
  kode_tiket: string
  user_id: number
  event_id: number
  jumlah: number
  total_harga: number
  metode_bayar: string
  status_bayar: 'menunggu' | 'lunas' | 'dibatalkan' | 'refund'
  nama_pemesan: string
  email_pemesan: string
  telepon_pemesan: string
  catatan: string
  bukti_bayar: string | null
  created_at: string
  judul: string
  kategori: string
  tanggal: string
  lokasi: string
  kota: string
}

interface TicketListResponse {
  success: boolean
  tikets: AdminTicket[]
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [proofModal, setProofModal] = useState<AdminTicket | null>(null)

  const loadTickets = async () => {
    try {
      setLoading(true)
      const response = await apiRequest<TicketListResponse>('/tiket/admin/semua')
      setTickets(response.tikets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data tiket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  const handleUpdateStatus = async (id: number, status: 'lunas' | 'dibatalkan') => {
    if (!confirm(`Apakah Anda yakin ingin mengubah status pesanan ini menjadi ${status === 'lunas' ? 'LUNAS (ACC)' : 'DIBATALKAN (REJECT)'}?`)) return

    try {
      await apiRequest(`/tiket/admin/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      setProofModal(null)
      void loadTickets()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status')
    }
  }

  const filteredTickets = tickets.filter(t => {
    const matchSearch = 
      t.kode_tiket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nama_pemesan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.judul.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchFilter = filterStatus === 'all' || t.status_bayar === filterStatus
    
    return matchSearch && matchFilter
  })

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-dark/10 bg-white px-4 py-2">
          <Search className="h-4 w-4 text-dark/40" />
          <input
            type="text"
            placeholder="Cari kode tiket, nama, atau event..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-dark/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-dark/40" />
          <select
            className="rounded-2xl border border-dark/10 bg-white px-4 py-2 text-sm outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="lunas">Lunas</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark/5 text-xs uppercase tracking-wider text-dark/50">
              <tr>
                <th className="px-6 py-4 font-bold">Tiket & Pemesan</th>
                <th className="px-6 py-4 font-bold">Event</th>
                <th className="px-6 py-4 font-bold">Jumlah & Total</th>
                <th className="px-6 py-4 font-bold">Bukti</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="transition hover:bg-dark/5">
                  <td className="px-6 py-4">
                    <div className="font-bold text-dark">{t.kode_tiket}</div>
                    <div className="text-xs text-dark/60">{t.nama_pemesan}</div>
                    <div className="text-[10px] text-dark/40">{t.email_pemesan}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[200px] truncate font-semibold text-dark" title={t.judul}>
                      {t.judul}
                    </div>
                    <div className="text-xs text-dark/60">{formatTanggalJam(t.tanggal)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-dark">{t.jumlah} Tiket</div>
                    <div className="text-xs font-bold text-saffron">{formatRupiah(t.total_harga)}</div>
                    <div className="text-[10px] uppercase text-dark/40">{t.metode_bayar === 'qris' ? 'QRIS' : 'Transfer Bank'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {t.bukti_bayar ? (
                      <button
                        onClick={() => setProofModal(t)}
                        className="flex items-center gap-1 rounded-lg bg-saffron/10 px-2 py-1 text-[10px] font-bold text-saffron hover:bg-saffron/20"
                      >
                        <Eye className="h-3 w-3" />
                        Lihat Bukti
                      </button>
                    ) : (
                      <span className="text-[10px] italic text-dark/30">Belum ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge type="status" value={t.status_bayar} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {t.status_bayar === 'menunggu' && (
                        <>
                          <button
                            onClick={() => t.bukti_bayar ? setProofModal(t) : handleUpdateStatus(t.id, 'lunas')}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm transition hover:bg-green-600"
                            title="Terima / Lunas"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(t.id, 'dibatalkan')}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm transition hover:bg-red-600"
                            title="Tolak / Batalkan"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {t.status_bayar === 'lunas' && (
                        <span className="rounded-lg bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
                          ✓ Disetujui
                        </span>
                      )}
                      {t.status_bayar === 'dibatalkan' && (
                        <span className="text-[10px] italic text-dark/30">Ditolak</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-dark/40">
                    Tidak ada pesanan tiket ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Bukti Bayar */}
      <Modal
        isOpen={Boolean(proofModal)}
        onClose={() => setProofModal(null)}
        title="Verifikasi Bukti Pembayaran"
        size="lg"
      >
        {proofModal && (
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="grid gap-4 rounded-2xl bg-cream p-5 text-sm sm:grid-cols-2">
              <div>
                <div className="text-dark/50">Kode Tiket</div>
                <div className="font-bold text-dark">{proofModal.kode_tiket}</div>
              </div>
              <div>
                <div className="text-dark/50">Pemesan</div>
                <div className="font-bold text-dark">{proofModal.nama_pemesan}</div>
              </div>
              <div>
                <div className="text-dark/50">Event</div>
                <div className="font-semibold text-dark">{proofModal.judul}</div>
              </div>
              <div>
                <div className="text-dark/50">Total Bayar</div>
                <div className="font-bold text-saffron">{formatRupiah(proofModal.total_harga)}</div>
              </div>
              <div>
                <div className="text-dark/50">Metode</div>
                <div className="font-semibold text-dark">
                  {proofModal.metode_bayar === 'qris' ? '📱 QRIS' : '🏦 Transfer Bank'}
                </div>
              </div>
              <div>
                <div className="text-dark/50">Status</div>
                <Badge type="status" value={proofModal.status_bayar} />
              </div>
            </div>

            {/* Bukti Bayar Image */}
            {proofModal.bukti_bayar ? (
              <div className="space-y-2">
                <div className="text-sm font-bold text-dark">Bukti Pembayaran:</div>
                <div className="overflow-hidden rounded-2xl border border-dark/10 bg-gray-50">
                  <img
                    src={proofModal.bukti_bayar}
                    alt="Bukti Bayar"
                    className="max-h-[400px] w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-cultureYellow/30 bg-cultureYellow/10 p-4 text-sm text-dark">
                ⚠️ Pelanggan belum mengunggah bukti pembayaran.
              </div>
            )}

            {/* Action Buttons */}
            {proofModal.status_bayar === 'menunggu' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus(proofModal.id, 'lunas')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3 font-bold text-white transition hover:bg-green-600"
                >
                  <Check className="h-5 w-5" />
                  ACC — Setujui Pembayaran
                </button>
                <button
                  onClick={() => handleUpdateStatus(proofModal.id, 'dibatalkan')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
                >
                  <X className="h-5 w-5" />
                  Tolak Pembayaran
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
