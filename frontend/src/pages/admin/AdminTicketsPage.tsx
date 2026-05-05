import { useEffect, useState } from 'react'
import { apiRequest } from '../../api/client'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import { formatRupiah, formatTanggalJam } from '../../utils/helpers'
import { Check, X, Search, Filter } from 'lucide-react'

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
    if (!confirm(`Apakah Anda yakin ingin mengubah status pesanan ini menjadi ${status === 'lunas' ? 'LUNAS' : 'DIBATALKAN'}?`)) return

    try {
      await apiRequest(`/tiket/admin/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      // Refresh data
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
                    <div className="text-[10px] uppercase text-dark/40">{t.metode_bayar.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge type="status" value={t.status_bayar} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {t.status_bayar === 'menunggu' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(t.id, 'lunas')}
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
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'dibatalkan')}
                          className="rounded-lg border border-red-200 px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50"
                        >
                          Batalkan Tiket
                        </button>
                      )}
                      {t.status_bayar === 'dibatalkan' && (
                        <span className="text-[10px] italic text-dark/30">Dibatalkan</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-dark/40">
                    Tidak ada pesanan tiket ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
