import { useEffect, useState } from 'react'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { classNames } from '../../utils/helpers'
import Button from '../ui/Button'

const navItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Blog', to: '/blog' },
  { label: 'Kontak', to: '/kontak' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      className={classNames(
        'sticky top-0 z-50 border-b border-saffron/20 bg-cream/95 backdrop-blur-xl transition-shadow',
        scrolled && 'shadow-panel'
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-gold text-xl shadow-lg shadow-saffron/20">
            🎵
          </div>
          <div className="font-display text-[2rem] font-bold leading-none text-dark">SeniLokal</div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={isAdmin ? '/admin/dashboard' : '/login'}
            className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}
          >
            Admin
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="secondary" className="min-w-[92px] bg-transparent">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button className="min-w-[92px] bg-[#22C55E] shadow-none hover:bg-[#18b04d]">
                  Daftar
                </Button>
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-dark/80 xl:block">{user?.nama}</span>
              <Link to={isAdmin ? '/admin/dashboard' : '/riwayat'}>
                <Button variant="secondary" className="min-w-[92px] bg-transparent">
                  {isAdmin ? 'Admin' : 'Tiket'}
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                className="min-w-[92px] bg-[#22C55E] shadow-none hover:bg-[#18b04d]"
              >
                Keluar
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-saffron/30 text-dark lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-saffron/15 bg-cream lg:hidden">
          <div className="container-page space-y-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'block rounded-xl px-4 py-3 text-sm font-medium text-dark transition hover:bg-white',
                    isActive && 'bg-white text-saffron'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to={isAdmin ? '/admin/dashboard' : '/login'}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-dark transition hover:bg-white',
                  isActive && 'bg-white text-saffron'
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </NavLink>

            {!isAuthenticated ? (
              <div className="grid gap-3 pt-2">
                <Link to="/login">
                  <Button variant="secondary" fullWidth>
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button fullWidth className="bg-[#22C55E] shadow-none hover:bg-[#18b04d]">
                    Daftar
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-[12px] border border-saffron/15 bg-white p-4">
                <div className="mb-3 text-sm text-dark/80">
                  Masuk sebagai <span className="font-semibold text-dark">{user?.nama}</span>
                </div>
                <div className="grid gap-3">
                  <Link to={isAdmin ? '/admin/dashboard' : '/riwayat'}>
                    <Button variant="secondary" fullWidth>
                      {isAdmin ? 'Dashboard Admin' : 'Riwayat Tiket'}
                    </Button>
                  </Link>
                  <Button
                    fullWidth
                    onClick={handleLogout}
                    className="bg-[#22C55E] shadow-none hover:bg-[#18b04d]"
                  >
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
