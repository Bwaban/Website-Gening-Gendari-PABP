import { Link } from 'react-router-dom'

const categories = ['Gending Gandari', 'Karawitan', 'Wayang', 'Tari Tradisional']

export default function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-dark text-cream">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/g2pro.svg" alt="SeniLokal Logo" className="h-10 w-auto brightness-0 invert" />
            <div className="font-display text-[2rem] font-bold leading-none text-white">SeniLokal</div>
          </Link>
          <p className="max-w-md font-body leading-7 text-cream/70">
            Platform digital untuk melestarikan dan mempromosikan seni budaya Gending Gandari dan karawitan Indonesia.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
            Navigasi
          </h3>
          <div className="space-y-3 text-sm text-cream/70">
            <Link className="block transition hover:text-saffron" to="/">
              Beranda
            </Link>
            <Link className="block transition hover:text-saffron" to="/tentang">
              Tentang
            </Link>
            <Link className="block transition hover:text-saffron" to="/blog">
              Blog
            </Link>
            <Link className="block transition hover:text-saffron" to="/kontak">
              Kontak
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
            Kategori
          </h3>
          <div className="space-y-3 text-sm text-cream/70">
            {categories.map((category) => (
              <Link
                key={category}
                className="block transition hover:text-saffron"
                to={`/events?kategori=${encodeURIComponent(category)}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
            Kontak
          </h3>
          <div className="space-y-3 text-sm text-cream/70">
            <p>Email@Email.com</p>
            <p>+62 812 1234 5678</p>
            <p>Jl. Kebanggan no 123, Jakarta</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-cream/50">
        © {new Date().getFullYear()} SeniLokal. Dibuat dengan ❤ untuk pelestarian seni budaya Indonesia.
      </div>
    </footer>
  )
}
