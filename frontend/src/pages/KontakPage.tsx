import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { apiRequest } from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import type { KontakData } from '../types'

const initialForm: KontakData = {
  nama: '',
  email: '',
  subjek: '',
  pesan: '',
}

export default function KontakPage() {
  const [form, setForm] = useState<KontakData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const updateField = <K extends keyof KontakData>(key: K, value: KontakData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await apiRequest<{ success: boolean; message?: string }>('/kontak', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setMessage(
        response.message || 'Pesan berhasil dikirim! Kami akan membalas secepatnya.'
      )
      setForm(initialForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim pesan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-14">
      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
              Kontak
            </p>
            <h1 className="section-title">Mari ngobrol tentang pertunjukan berikutnya</h1>
            <p className="section-copy">
              Kirim pertanyaan, saran, atau kebutuhan kolaborasi melalui formulir ini.
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <Input
                label="Nama Lengkap"
                value={form.nama}
                onChange={(event) => updateField('nama', event.target.value)}
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
                label="Subjek"
                value={form.subjek}
                onChange={(event) => updateField('subjek', event.target.value)}
                required
              />
              <Input
                label="Pesan"
                textarea
                value={form.pesan}
                onChange={(event) => updateField('pesan', event.target.value)}
                required
              />

              {message ? (
                <div className="rounded-2xl border border-cultureGreen/20 bg-cultureGreen/10 px-4 py-3 text-sm text-cultureGreen">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                  {error}
                </div>
              ) : null}

              <Button type="submit" size="lg" loading={loading}>
                Kirim Pesan
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Card className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-dark">Informasi Kontak</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-[24px] bg-cream p-4">
                <Mail className="mt-0.5 h-5 w-5 text-saffron" />
                <div>
                  <div className="font-semibold text-dark">Email</div>
                  <div className="text-sm text-dark/70">info@senilokal.id</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[24px] bg-cream p-4">
                <Phone className="mt-0.5 h-5 w-5 text-saffron" />
                <div>
                  <div className="font-semibold text-dark">Telepon</div>
                  <div className="text-sm text-dark/70">+62 811-XXXX-XXXX</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[24px] bg-cream p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-saffron" />
                <div>
                  <div className="font-semibold text-dark">Alamat</div>
                  <div className="text-sm text-dark/70">Bandung, Jawa Barat, Indonesia</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
