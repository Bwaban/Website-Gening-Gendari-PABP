import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import type { RegisterData } from '../types'

const initialForm: RegisterData = {
  nama: '',
  username: '',
  email: '',
  password: '',
  telepon: '',
  kota: '',
  umur: undefined,
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const [form, setForm] = useState<RegisterData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const updateField = <K extends keyof RegisterData>(key: K, value: RegisterData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register({
        ...form,
        telepon: form.telepon || undefined,
        kota: form.kota || undefined,
        umur: form.umur || undefined,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-dark via-[#2A1A08] to-saffron p-8 text-center text-white">
            <div className="mb-3 text-5xl">🎼</div>
            <h1 className="font-display text-4xl font-bold">Buat Akun Baru</h1>
            <p className="mt-2 font-body text-white/75">
              Daftar untuk mulai memesan pertunjukan favoritmu
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                value={form.nama}
                onChange={(event) => updateField('nama', event.target.value)}
                required
              />
              <Input
                label="Username"
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                minLength={6}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                required
              />
              <Input
                label="No. Telepon"
                value={form.telepon}
                onChange={(event) => updateField('telepon', event.target.value)}
              />
              <Input
                label="Kota"
                value={form.kota}
                onChange={(event) => updateField('kota', event.target.value)}
              />
              <Input
                label="Umur"
                type="number"
                min={1}
                value={form.umur ?? ''}
                onChange={(event) =>
                  updateField('umur', event.target.value ? Number(event.target.value) : undefined)
                }
              />
              <div className="md:col-span-2">
                {error ? (
                  <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                    {error}
                  </div>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  Daftar
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-dark/65">
              Sudah punya akun?{' '}
              <Link className="font-semibold text-saffron" to="/login">
                Masuk
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
