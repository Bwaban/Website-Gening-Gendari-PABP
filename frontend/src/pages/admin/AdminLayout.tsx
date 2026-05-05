import { LayoutDashboard, LogOut, Music4, ShoppingCart } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { classNames } from '../../utils/helpers'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/events', label: 'Pertunjukan', icon: Music4 },
  { to: '/admin/tickets', label: 'Pesanan Tiket', icon: ShoppingCart },
]

const pageTitleMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/events': 'Manajemen Pertunjukan',
  '/admin/events/create': 'Tambah Pertunjukan',
  '/admin/tickets': 'Daftar Pesanan Tiket',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const pageTitle =
    pageTitleMap[location.pathname] ??
    (location.pathname.startsWith('/admin/events/edit/') ? 'Edit Pertunjukan' : 'Admin')

  return (
    <div className="min-h-screen bg-[#f7efe1] text-dark">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col justify-between bg-dark p-6 text-cream">
          <div className="space-y-8">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron to-gold text-2xl">
                  🎼
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">
                    SeniLokal
                  </div>
                  <div className="text-xs uppercase tracking-[0.32em] text-cream/55">
                    Admin
                  </div>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      classNames(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-saffron text-white'
                          : 'text-cream/70 hover:bg-white/5 hover:text-white'
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-cream/55">Masuk sebagai</div>
              <div className="mt-1 font-display text-2xl font-bold text-white">
                {user?.nama}
              </div>
              <div className="mt-3">
                <Badge value={user?.role ?? 'admin'} className="bg-gold text-dark" />
              </div>
            </div>

            <Button
              variant="danger"
              fullWidth
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Keluar
            </Button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-dark/10 bg-[#f7efe1]/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-8">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron">
                  Panel Admin
                </div>
                <h1 className="font-display text-3xl font-bold text-dark">{pageTitle}</h1>
              </div>
              <div className="hidden rounded-full border border-dark/10 bg-white px-4 py-2 text-sm font-semibold text-dark/70 sm:block">
                {user?.nama}
              </div>
            </div>
          </header>

          <main className="px-6 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
