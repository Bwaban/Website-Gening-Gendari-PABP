export interface Event {
  id: number
  judul: string
  kategori: 'Gending Gandari' | 'Karawitan' | 'Wayang' | 'Tari Tradisional'
  deskripsi: string
  tanggal: string
  kota: string
  lokasi: string
  harga: number
  kuota: number
  tiket_terjual: number
  status: 'tersedia' | 'terbatas' | 'habis'
  gradient_style: string
  emoji: string
  gambar_url?: string
  created_at?: string
}

export interface TicketEventSummary {
  id?: number
  judul: string
  tanggal: string
  kota: string
  lokasi: string
  emoji: string
}

export interface Tiket {
  id: number
  kode_tiket: string
  event_id: number
  jumlah: number
  total_harga: number
  metode_bayar: 'transfer_bank' | 'qris'
  status_bayar: 'menunggu' | 'lunas' | 'dibatalkan' | 'refund'
  nama_pemesan: string
  email_pemesan: string
  telepon_pemesan?: string
  catatan?: string
  bukti_bayar?: string
  created_at: string
  event?: TicketEventSummary
}

export interface AuthUser {
  id: number
  nama: string
  username: string
  email: string
  telepon?: string
  kota?: string
  umur?: number
  role: 'user' | 'admin'
}

export interface RegisterData {
  nama: string
  username: string
  email: string
  password: string
  telepon?: string
  kota?: string
  umur?: number
}

export interface KontakData {
  nama: string
  email: string
  subjek: string
  pesan: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  token?: string
  user?: AuthUser
}

export interface EventFilters {
  search?: string
  kategori?: string
  kota?: string
  tanggalMulai?: string
  tanggalAkhir?: string
}

export interface EventFormData {
  judul: string
  kategori: Event['kategori']
  deskripsi: string
  tanggal: string
  kota: string
  lokasi: string
  harga: number
  kuota: number
  tiket_terjual: number
  status: Event['status']
  gradient_style: string
  emoji: string
  gambar_url?: string
}

export interface BlogArticle {
  id: string
  judul: string
  kategori: string
  tanggal: string
  author: string
  excerpt: string
  content: string
  image: string
  readTime: number
  emoji?: string
  gradient?: string
}
