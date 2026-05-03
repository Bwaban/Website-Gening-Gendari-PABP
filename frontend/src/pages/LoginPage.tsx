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
    <div className="flex min-h-[calc(100vh-80px)] w-full">
      <div className="relative hidden w-1/2 flex-col justify-center bg-dark p-12 text-white lg:flex xl:p-20 overflow-hidden">
        <div className="absolute left-12 top-12 flex items-center gap-3 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C8792A] text-white">
            <span className="text-xl">🎵</span>
          </div>
          <span className="font-display text-2xl font-bold">SeniLokal</span>
        </div>
        
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-[30rem] text-white/[0.03] select-none">
          🎵
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight xl:text-5xl">
            Selamat Datang<br />di Dunia <span className="text-[#C8792A] italic">Gending Gandari</span>
          </h1>
          <p className="text-white/70 font-body text-sm xl:text-base leading-relaxed max-w-md">
            Masuk ke akun Anda untuk mulai menjelajahi pertunjukan seni budaya terbaik Indonesia dan mendapatkan tiket eksklusif.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-cream p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-dark">Masuk</h2>
            <p className="mt-2 text-dark/75 text-sm">Selamat datang kembali</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              placeholder="Username Anda"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              required
              className="bg-white"
            />

            <div className="space-y-2">
              <div className="text-sm font-semibold text-dark">Password</div>
              <div className="flex items-center rounded-[10px] border border-[#e8d5b5] bg-white px-4 py-3 shadow-sm focus-within:border-saffron focus-within:ring-4 focus-within:ring-saffron/10">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-transparent text-sm text-dark outline-none placeholder:text-dark/35"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-dark/50 transition hover:text-dark ml-2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                {error}
              </div>
            ) : null}

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Masuk
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-cream px-4 text-dark/65">Atau</span>
            </div>
          </div>

          <div className="text-center text-sm text-dark/80">
            Belum punya akun?{' '}
            <Link className="font-semibold text-saffron hover:underline" to="/register">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
