import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-2xl space-y-6 text-center">
        <div className="text-7xl">🎭</div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">404</p>
        <h1 className="font-display text-5xl font-bold text-dark">
          Halaman yang kamu cari tidak ditemukan
        </h1>
        <p className="font-body text-lg leading-8 text-dark/70">
          Mungkin halaman sudah dipindahkan, atau rute yang dimasukkan belum tersedia.
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button size="lg">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
