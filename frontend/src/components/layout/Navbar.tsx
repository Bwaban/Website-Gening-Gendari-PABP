import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import { classNames } from '../../utils/helpers'

const navItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Event', to: '/events' },
  { label: 'Blog', to: '/blog' },
  { label: 'Kontak', to: '/kontak' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setAccountOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = useMemo(() => {
    if (!user?.nama) return 'SL'
    return user.nama
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [user?.nama])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      className={classNames(
        'sticky top-0 z-50 border-b border-white/10 bg-dark/95 text-cream backdrop-blur-xl transition-shadow',
        scrolled && 'shadow-2xl shadow-dark/20'
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron to-gold text-xl shadow-lg shadow-saffron/20">
            🎼
          </div>
          <div>
            <div className="font-display text-xl font-bold text-white">SeniLokal</div>
            <div className="text-xs uppercase tracking-[0.3em] text-cream/60">Tixly</div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  'text-sm font-medium transition hover:text-saffron',
                  isActive && 'text-saffron'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin ? (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                classNames(
                  'rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition hover:border-saffron hover:text-saffron',
                  isActive && 'border-saffron text-saffron'
                )
              }
            >
              Dashboard
            </NavLink>
          ) : null}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-cream hover:bg-white/10 hover:text-white">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button>Daftar</Button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-saffron/40 hover:bg-white/10"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-gold font-semibold text-white">
                  {initials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-white">
                    {user?.nama ?? 'Akun'}
                  </span>
                  <span className="block text-xs text-cream/60">
                    {isAdmin ? 'Administrator' : 'Pengunjung'}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-cream/70" />
              </button>

              {accountOpen ? (
                <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-dark/10 bg-white p-2 text-dark shadow-soft">
                  {!isAdmin ? (
                    <button
                      type="button"
                      onClick={() => navigate('/riwayat')}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition hover:bg-cream"
                    >
                      <Ticket className="h-4 w-4 text-saffron" />
                      Riwayat Tiket
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition hover:bg-cream"
                  >
                    <LogOut className="h-4 w-4 text-cultureRed" />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-dark lg:hidden">
          <div className="container-page space-y-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'block rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/5',
                    isActive && 'bg-white/5 text-saffron'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/5',
                    isActive && 'bg-white/5 text-saffron'
                  )
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
            ) : null}
            {!isAuthenticated ? (
              <div className="grid gap-3 pt-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    fullWidth
                    className="border border-white/10 text-cream hover:bg-white/10 hover:text-white"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button fullWidth>Daftar</Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 text-sm text-cream/70">
                  Masuk sebagai <span className="font-semibold text-white">{user?.nama}</span>
                </div>
                <div className="grid gap-3">
                  {!isAdmin ? (
                    <Link to="/riwayat">
                      <Button variant="secondary" fullWidth className="text-cream hover:text-white">
                        Riwayat Tiket
                      </Button>
                    </Link>
                  ) : null}
                  <Button variant="danger" fullWidth onClick={handleLogout}>
                    Keluar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  )
}
