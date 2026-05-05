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
    <div className="flex min-h-[calc(100vh-80px)] w-full">
      <div className="relative hidden w-1/2 flex-col justify-center bg-culturePurple p-12 text-white lg:flex xl:p-20 overflow-hidden">
        <div className="absolute left-12 top-12 flex items-center gap-3 z-10">
          <img src="/g2pro.svg" alt="Logo" className="h-10 w-auto brightness-0 invert" />
          <span className="font-display text-2xl font-bold">SeniLokal</span>
        </div>
        
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
          <img src="/g2pro.svg" alt="" className="w-[40rem] h-auto brightness-0 invert" />
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight xl:text-5xl">
            Bergabunglah Bersama<br /><span className="text-saffron italic">Komunitas Seni</span>
          </h1>
          <p className="text-white/70 font-body text-sm xl:text-base leading-relaxed max-w-md">
            Daftarkan diri Anda dan jadilah bagian dari ribuan pecinta seni Gending Gandari yang melestarikan warisan budaya Nusantara.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-cream p-8 lg:w-1/2 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-dark">Daftar</h2>
            <p className="mt-2 text-dark/75 text-sm">Bergabunglah Dengan Kami</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2/3">
                <Input
                  label="Nama Lengkap"
                  value={form.nama}
                  onChange={(event) => updateField('nama', event.target.value)}
                  required
                  placeholder="Nama Lengkap"
                  className="bg-white"
                />
              </div>
              <div className="w-1/3">
                <Input
                  label="Umur"
                  type="number"
                  min={1}
                  value={form.umur ?? ''}
                  onChange={(event) =>
                    updateField('umur', event.target.value ? Number(event.target.value) : undefined)
                  }
                  placeholder="Umur"
                  className="bg-white"
                />
              </div>
            </div>
            
            <Input
              label="Asal Kota"
              value={form.kota}
              onChange={(event) => updateField('kota', event.target.value)}
              placeholder="Kota Anda"
              className="bg-white"
            />
            
            <Input
              label="Username"
              value={form.username}
              onChange={(event) => updateField('username', event.target.value)}
              required
              placeholder="Username unik Anda"
              className="bg-white"
            />
            
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
              placeholder="email@contoh.com"
              className="bg-white"
            />
            
            <Input
              label="Password"
              type="password"
              minLength={6}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
              placeholder="********"
              className="bg-white"
            />
            
            <Input
              label="Nomor Telepon"
              value={form.telepon}
              onChange={(event) => updateField('telepon', event.target.value)}
              placeholder="+62 8xx xxxx xxxx"
              className="bg-white"
            />

            {error ? (
              <div className="rounded-xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                {error}
              </div>
            ) : null}

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-4">
              Daftar
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
            Sudah punya akun?{' '}
            <Link className="font-semibold text-saffron hover:underline" to="/login">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
