import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { apiRequest } from '../api/client'
import AccordionItem from '../components/marketing/AccordionItem'
import InfoTile from '../components/marketing/InfoTile'
import PageHero from '../components/marketing/PageHero'
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
      setMessage(response.message || 'Pesan berhasil dikirim! Kami akan membalas secepatnya.')
      setForm(initialForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim pesan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell bg-cream">
      <PageHero
        badge="✨ Hubungi Kami"
        title={
          <>
            Ada Pertanyaan?
            <br />
            Kami Siap Membantu
          </>
        }
        description="Tim kami siap menjawab pertanyaan dan membantu Anda dalam setiap langkah."
        variant="pink"
      />

      <section className="py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <InfoTile icon={Mail} title="Email" content="Email@Email.com" />
            <InfoTile icon={Phone} title="Telepon" content="+62 812 1234 5678" />
            <InfoTile icon={MapPin} title="Alamat" content="Jl. Kebanggan no 123, Jakarta 12345" />
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
            <Card className="p-7">
              <h2 className="font-display text-4xl font-bold text-dark">Kirim Pesan</h2>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-saffron to-transparent" />
              <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                <Input
                  label="Nama Lengkap"
                  placeholder="Nama Lengkap Anda"
                  value={form.nama}
                  onChange={(event) => updateField('nama', event.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                />
                <Input
                  label="Subjek"
                  placeholder="Subjek pesan"
                  value={form.subjek}
                  onChange={(event) => updateField('subjek', event.target.value)}
                  required
                />
                <Input
                  label="Pesan"
                  textarea
                  className="min-h-[140px]"
                  placeholder="Tulis pesan Anda di sini..."
                  value={form.pesan}
                  onChange={(event) => updateField('pesan', event.target.value)}
                  required
                />

                {message ? (
                  <div className="rounded-[10px] border border-cultureGreen/20 bg-cultureGreen/10 px-4 py-3 text-sm text-cultureGreen">
                    {message}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[10px] border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
                    {error}
                  </div>
                ) : null}

                <Button type="submit" size="lg" fullWidth loading={loading}>
                  Kirim Pesan
                </Button>
              </form>
            </Card>

            <Card className="space-y-8 p-7">
              <div>
                <h2 className="font-display text-4xl font-bold text-dark">Jam Operasional</h2>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-saffron to-transparent" />
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-[#efe1cb] pb-3">
                    <span className="text-dark/72">Senin - Jumat</span>
                    <span className="font-semibold text-dark">09:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#efe1cb] pb-3">
                    <span className="text-dark/72">Sabtu</span>
                    <span className="font-semibold text-dark">09:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark/72">Minggu & Libur</span>
                    <span className="font-semibold text-cultureRed">Tutup</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-4xl font-bold text-dark">Lokasi Kantor Kami</h2>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-saffron to-transparent" />
                <div className="mt-6 rounded-[10px] border border-dashed border-[#e1caa9] bg-cream px-6 py-12 text-center">
                  <div className="text-xl">📍</div>
                  <div className="mt-4 text-dark/70">Jl. Kebanggan no 123</div>
                  <div className="mt-1 text-dark/70">Jakarta 12345, Indonesia</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="text-center">
              <p className="soft-label">FAQ</p>
              <h2 className="section-title mt-3">Pertanyaan Umum</h2>
              <p className="section-copy mx-auto mt-3">
                Temukan jawaban dari pertanyaan yang sering ditanyakan.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <AccordionItem
                question="Apa itu Gending Gandari?"
                answer="Gending Gandari adalah salah satu bentuk komposisi karawitan tradisional Sunda yang memiliki struktur melodi khas dan nilai budaya yang kuat."
                defaultOpen
              />
              <AccordionItem
                question="Bagaimana cara membeli tiket pertunjukan?"
                answer="Anda bisa memilih acara dari halaman beranda atau daftar event, lalu masuk ke halaman detail untuk melanjutkan proses pemesanan tiket."
              />
              <AccordionItem
                question="Apakah bisa mendaftarkan pertunjukan seni saya?"
                answer="Bisa. Tim kami membuka peluang kolaborasi dengan komunitas, sanggar, dan penyelenggara acara seni tradisional dari berbagai daerah."
              />
              <AccordionItem
                question="Apakah tiket bisa di-refund jika acara dibatalkan?"
                answer="Jika acara dibatalkan oleh penyelenggara, tim kami akan membantu proses refund atau penjadwalan ulang sesuai kebijakan event terkait."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
