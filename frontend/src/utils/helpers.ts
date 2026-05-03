import type { Tiket } from '../types'

const EVENT_THEME_MAP: Record<
  string,
  {
    gradient: string
    emoji: string
  }
> = {
  'Gending Gandari': {
    gradient: 'linear-gradient(135deg, #6A431C 0%, #D1842C 100%)',
    emoji: '🎼',
  },
  Karawitan: {
    gradient: 'linear-gradient(135deg, #1E5A36 0%, #2D7A4A 100%)',
    emoji: '🏺',
  },
  Wayang: {
    gradient: 'linear-gradient(135deg, #4A235A 0%, #6C2E8F 100%)',
    emoji: '🎭',
  },
  'Tari Tradisional': {
    gradient: 'linear-gradient(135deg, #4A4A10 0%, #7A7A1F 100%)',
    emoji: '🎵',
  },
  'Budaya Lokal': {
    gradient: 'linear-gradient(135deg, #6F2B16 0%, #9B431F 100%)',
    emoji: '🥁',
  },
}

export const formatRupiah = (amount: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

export const formatTanggal = (isoString: string): string =>
  new Date(isoString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const formatTanggalJam = (isoString: string): string => {
  const d = new Date(isoString)
  const tanggal = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const jam = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${tanggal} · ${jam} WIB`
}

export const sisaKuota = (kuota: number, terjual: number): number =>
  Math.max(0, kuota - terjual)

export const persenTerjual = (kuota: number, terjual: number): number =>
  kuota <= 0 ? 0 : Math.min(100, Math.round((terjual / kuota) * 100))

export const labelMetodeBayar = (metode: string): string =>
  metode === 'transfer_bank' ? '🏦 Transfer Bank' : '💳 Dompet Digital'

export const toDateOnly = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toDatetimeLocal = (isoString: string): string => {
  const date = new Date(isoString)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

export const classNames = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ')

export const getEventTheme = (category: string) =>
  EVENT_THEME_MAP[category] ?? {
    gradient: 'linear-gradient(135deg, #4A3218 0%, #C8792A 100%)',
    emoji: '🎶',
  }

export const mapTicketRow = (ticket: Record<string, unknown>): Tiket => ({
  id: Number(ticket.id),
  kode_tiket: String(ticket.kode_tiket ?? ''),
  event_id: Number(ticket.event_id),
  jumlah: Number(ticket.jumlah ?? 0),
  total_harga: Number(ticket.total_harga ?? 0),
  metode_bayar: (ticket.metode_bayar as Tiket['metode_bayar']) ?? 'transfer_bank',
  status_bayar: (ticket.status_bayar as Tiket['status_bayar']) ?? 'menunggu',
  nama_pemesan: String(ticket.nama_pemesan ?? ''),
  email_pemesan: String(ticket.email_pemesan ?? ''),
  telepon_pemesan: ticket.telepon_pemesan ? String(ticket.telepon_pemesan) : undefined,
  catatan: ticket.catatan ? String(ticket.catatan) : undefined,
  created_at: String(ticket.created_at ?? new Date().toISOString()),
  event:
    ticket.judul && ticket.tanggal && ticket.lokasi && ticket.kota
      ? {
          judul: String(ticket.judul),
          tanggal: String(ticket.tanggal),
          lokasi: String(ticket.lokasi),
          kota: String(ticket.kota),
          emoji: String(ticket.emoji ?? '🎭'),
        }
      : undefined,
})
