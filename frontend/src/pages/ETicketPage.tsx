import { useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
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

  const invoiceRef = useRef<HTMLDivElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  if (!ticket) {
    return <Navigate to="/riwayat" replace />
  }

  const downloadPdf = async () => {
    if (!invoiceRef.current || !ticketRef.current) return
    setDownloading(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const margin = 10
      const contentWidth = pdfWidth - margin * 2

      // Capture Invoice
      const invoiceCanvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true })
      const invoiceData = invoiceCanvas.toDataURL('image/jpeg', 1.0)
      const invoiceHeight = (invoiceCanvas.height * contentWidth) / invoiceCanvas.width
      pdf.addImage(invoiceData, 'JPEG', margin, margin, contentWidth, invoiceHeight)

      pdf.addPage()

      // Capture Ticket
      const ticketCanvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true })
      const ticketData = ticketCanvas.toDataURL('image/jpeg', 1.0)
      const ticketHeight = (ticketCanvas.height * contentWidth) / ticketCanvas.width
      pdf.addImage(ticketData, 'JPEG', margin, margin, contentWidth, ticketHeight)

      pdf.save(`Tiket-${ticket.kode_tiket}.pdf`)
    } catch (err) {
      console.error(err)
      alert('Gagal mendownload PDF')
    } finally {
      setDownloading(false)
    }
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
        <div className="space-y-3 text-center no-print">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            E-Ticket & Invoice
          </p>
          <h1 className="section-title">Tiket pertunjukanmu sudah siap</h1>
          <p className="section-copy mx-auto">
            Unduh halaman ini sebagai bukti pemesanan dan tiket masuk.
          </p>
        </div>

        {/* INVOICE SECTION */}
        <div className="bg-white p-8 sm:p-12 border border-dark/10 rounded-2xl shadow-sm">
          <div ref={invoiceRef} className="bg-white text-dark space-y-8 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-dark/10 pb-6">
              <div>
                <h2 className="font-display text-3xl font-bold text-dark">INVOICE</h2>
                <p className="text-sm text-dark/60 mt-1">SeniLokal Indonesia</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-bold">Kode Pemesanan:</p>
                <p className="text-lg text-saffron font-bold">{ticket.kode_tiket}</p>
                <p className="text-xs text-dark/60 mt-1">Tanggal Pesan: {new Date(ticket.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-dark/40 mb-1">Ditagihkan Kepada:</p>
                <p className="font-bold text-lg">{ticket.nama_pemesan}</p>
                <p className="text-sm text-dark/70">{ticket.email_pemesan}</p>
                {ticket.telepon_pemesan && <p className="text-sm text-dark/70">{ticket.telepon_pemesan}</p>}
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-dark/40 mb-1">Status Pembayaran:</p>
                <div className="inline-block px-3 py-1 bg-cultureGreen/10 text-cultureGreen font-bold rounded-full text-sm uppercase tracking-wider">
                  {ticket.status_bayar === 'lunas' ? 'LUNAS' : ticket.status_bayar}
                </div>
                <p className="text-sm text-dark/70 mt-2">Metode: {labelMetodeBayar(ticket.metode_bayar)}</p>
              </div>
            </div>

            <table className="w-full text-left text-sm mt-8 border-collapse">
              <thead>
                <tr className="border-b-2 border-dark/20 text-dark/60 uppercase tracking-wider">
                  <th className="py-3 px-2 font-bold">Deskripsi Event</th>
                  <th className="py-3 px-2 font-bold text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark/10">
                  <td className="py-4 px-2">
                    <p className="font-bold text-base">{ticket.event?.judul ?? 'Pertunjukan SeniLokal'}</p>
                    <p className="text-dark/60 mt-1">{ticket.event?.tanggal ? formatTanggalJam(ticket.event.tanggal) : '-'}</p>
                    <p className="text-dark/60">{ticket.event?.lokasi ?? '-'}</p>
                  </td>
                  <td className="py-4 px-2 text-right font-semibold align-top">{ticket.jumlah} Tiket</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-4">
              <div className="w-full sm:w-1/2">
                <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-dark">
                  <span>Total Tagihan:</span>
                  <span className="text-saffron">{formatRupiah(ticket.total_harga)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-xs text-dark/40 mt-12 pt-8 border-t border-dark/10">
              Ini adalah invoice sah yang diterbitkan oleh sistem SeniLokal.<br/>
              Terima kasih telah mendukung seni pertunjukan tradisional Indonesia.
            </div>
          </div>
        </div>

        {/* TICKET SECTION */}
        <div ref={ticketRef} className="bg-cream pt-4 pb-4">
          <Card padding="none" className="ticket-cutout relative overflow-hidden shadow-panel mx-4">
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
        </div>

        {ticket.status_bayar === 'menunggu' ? (
          <div className="rounded-[24px] border border-cultureYellow/30 bg-cultureYellow/10 p-5 text-dark no-print">
            ⏳ Pembayaran berstatus <strong>menunggu verifikasi</strong>. Tiket dapat diunduh
            setelah pembayaran disetujui oleh admin.
          </div>
        ) : null}

        {ticket.status_bayar === 'dibatalkan' ? (
          <div className="rounded-[24px] border border-cultureRed/20 bg-cultureRed/5 p-5 text-cultureRed no-print">
            ❌ Tiket ini telah <strong>dibatalkan</strong>.
          </div>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3 no-print">
          {ticket.status_bayar === 'lunas' && (
            <Button size="lg" onClick={downloadPdf} loading={downloading}>
              Unduh Tiket PDF
            </Button>
          )}
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
