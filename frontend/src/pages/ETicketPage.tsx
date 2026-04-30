import { Link, Navigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import type { Tiket } from '../types'
import { formatRupiah, formatTanggalJam, labelMetodeBayar } from '../utils/helpers'

function DummyQr({ seed }: { seed: string }) {
  const cells = Array.from({ length: 64 }, (_, index) => {
    const charCode = seed.charCodeAt(index % seed.length)
    return ((charCode + index) % 3) !== 0
  })

  return (
    <div className="grid grid-cols-8 gap-1 rounded-2xl bg-white p-3 shadow-lg">
      {cells.map((cell, index) => (
        <div
          key={index}
          className={`h-5 w-5 rounded-[2px] ${cell ? 'bg-dark' : 'bg-cream'}`}
        />
      ))}
    </div>
  )
}

export default function ETicketPage() {
  const location = useLocation()
  const ticket = (location.state as { ticket?: Tiket } | null)?.ticket

  if (!ticket) {
    return <Navigate to="/riwayat" replace />
  }

  const statusClass =
    ticket.status_bayar === 'menunggu'
      ? 'bg-cultureYellow/15 text-dark'
      : ticket.status_bayar === 'lunas'
        ? 'bg-cultureGreen/15 text-cultureGreen'
        : 'bg-cultureRed/10 text-cultureRed'

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            E-Ticket
          </p>
          <h1 className="section-title">Tiket pertunjukanmu sudah siap</h1>
          <p className="section-copy mx-auto">
            Simpan halaman ini atau cetak sebagai bukti pemesanan.
          </p>
        </div>

        <Card padding="none" className="ticket-cutout relative overflow-hidden">
          <div className="bg-gradient-to-r from-dark via-[#2A1A08] to-saffron px-8 py-8 text-white sm:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.32em] text-gold">🎼 SeniLokal</div>
                <div className="mt-2 font-display text-4xl font-bold">Tiket Pertunjukan</div>
                <div className="mt-2 text-sm text-white/75">Kode: {ticket.kode_tiket}</div>
              </div>
              <div className="self-center">
                <DummyQr seed={ticket.kode_tiket} />
              </div>
            </div>
          </div>

          <div className="border-y border-dashed border-dark/15 px-8 py-5 text-sm text-dark/50 sm:px-10">
            Presentasikan e-ticket ini saat memasuki venue. QR dummy ditampilkan
            sebagai representasi visual tiket digital.
          </div>

          <div className="grid gap-6 bg-cream px-8 py-8 sm:px-10 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-dark/50">Nama Event</div>
                <div className="font-display text-2xl font-bold text-dark">
                  {ticket.event?.judul ?? 'Pertunjukan SeniLokal'}
                </div>
              </div>
              <div>
                <div className="text-sm text-dark/50">Nama Pemesan</div>
                <div className="font-semibold text-dark">{ticket.nama_pemesan}</div>
              </div>
              <div>
                <div className="text-sm text-dark/50">Tanggal</div>
                <div className="font-semibold text-dark">
                  {ticket.event?.tanggal ? formatTanggalJam(ticket.event.tanggal) : '-'}
                </div>
              </div>
              <div>
                <div className="text-sm text-dark/50">Lokasi</div>
                <div className="font-semibold text-dark">{ticket.event?.lokasi ?? '-'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-dark/50">Jumlah Tiket</div>
                <div className="font-semibold text-dark">{ticket.jumlah} lembar</div>
              </div>
              <div>
                <div className="text-sm text-dark/50">Total Bayar</div>
                <div className="font-semibold text-dark">{formatRupiah(ticket.total_harga)}</div>
              </div>
              <div>
                <div className="text-sm text-dark/50">Metode Bayar</div>
                <div className="font-semibold text-dark">
                  {labelMetodeBayar(ticket.metode_bayar)}
                </div>
              </div>
              <div>
                <div className="text-sm text-dark/50">Status</div>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}>
                  {ticket.status_bayar}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {ticket.status_bayar === 'menunggu' ? (
          <div className="rounded-[24px] border border-cultureYellow/30 bg-cultureYellow/10 p-5 text-dark">
            ⚠️ Pembayaran berstatus <strong>menunggu</strong>. Silakan selesaikan
            pembayaran sesuai metode yang dipilih.
          </div>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3 no-print">
          <Button size="lg" onClick={() => window.print()}>
            Cetak Tiket
          </Button>
          <Link to="/riwayat">
            <Button size="lg" variant="secondary">
              Lihat Riwayat Tiket
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" variant="ghost">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
