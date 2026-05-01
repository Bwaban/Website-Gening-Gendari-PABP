import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isAdmin } = useAuth()
  const from = (location.state as { from?: string } | null)?.from
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/', { replace: true })
    }
  }, [isAdmin, isAuthenticated, navigate])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(identity, password)

      const freshUserRaw = localStorage.getItem('senilokal_user')
      const freshUser = freshUserRaw ? JSON.parse(freshUserRaw) : null

      if (freshUser?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate(from || '/', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg">
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-dark via-[#2A1A08] to-saffron p-8 text-center text-white">
            <div className="mb-3 text-5xl">🎼</div>
            <h1 className="font-display text-4xl font-bold">SeniLokal</h1>
            <p className="mt-2 font-body text-white/75">Masuk ke akunmu</p>
          </div>

          <div className="space-y-6 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email atau Username"
                type="text"
                placeholder="nama@email.com"
                value={identity}
                onChange={(event) => setIdentity(event.target.value)}
                required
              />

              <div className="space-y-2">
                <div className="text-sm font-semibold text-dark">Password</div>
                <div className="flex items-center rounded-2xl border border-saffron/20 bg-white px-4 py-3 shadow-sm focus-within:border-saffron focus-within:ring-4 focus-within:ring-saffron/10">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-transparent text-sm text-dark outline-none placeholder:text-dark/35"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-dark/50 transition hover:text-dark"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                  {error}
                </div>
              ) : null}

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Masuk
              </Button>
            </form>

            <div className="space-y-3 text-center text-sm text-dark/65">
              <p>
                Belum punya akun?{' '}
                <Link className="font-semibold text-saffron" to="/register">
                  Daftar di sini
                </Link>
              </p>
              <Link className="font-semibold text-dark" to="/">
                Kembali ke Beranda
              </Link>
            </div>

            <div className="rounded-[24px] border border-dark/10 bg-cream p-5 text-sm text-dark/70">
              <div className="mb-2 font-semibold text-dark">🔐 Demo Login</div>
              <p>User: daftar akun sendiri via halaman register.</p>
              <p>Admin: hubungi pengelola backend untuk akun admin.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
