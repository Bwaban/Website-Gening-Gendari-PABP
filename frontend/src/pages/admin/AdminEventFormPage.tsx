import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../../api/client'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import type { Event, EventFormData } from '../../types'
import { toDatetimeLocal } from '../../utils/helpers'

interface EventResponse {
  success: boolean
  event: Event
  message?: string
}

const initialForm: EventFormData = {
  judul: '',
  kategori: 'Gending Gandari',
  deskripsi: '',
  tanggal: '',
  kota: '',
  lokasi: '',
  harga: 0,
  kuota: 1,
  tiket_terjual: 0,
  status: 'tersedia',
  gradient_style: 'linear-gradient(135deg,#4A3218,#C8792A)',
  emoji: '🎼',
}

export default function AdminEventFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<EventFormData>(initialForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !id) return

    const loadEvent = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await apiRequest<EventResponse>(`/events/${id}`)
        const event = response.event
        setForm({
          judul: event.judul,
          kategori: event.kategori,
          deskripsi: event.deskripsi,
          tanggal: toDatetimeLocal(event.tanggal),
          kota: event.kota,
          lokasi: event.lokasi,
          harga: event.harga,
          kuota: event.kuota,
          tiket_terjual: event.tiket_terjual,
          status: event.status,
          gradient_style: event.gradient_style,
          emoji: event.emoji,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengambil data event')
      } finally {
        setLoading(false)
      }
    }

    void loadEvent()
  }, [id, isEdit])

  const updateField = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const previewGradient = useMemo(
    () => form.gradient_style || 'linear-gradient(135deg,#4A3218,#C8792A)',
    [form.gradient_style]
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        harga: Number(form.harga),
        kuota: Number(form.kuota),
        tiket_terjual: Number(form.tiket_terjual),
      }

      await apiRequest<EventResponse>(isEdit ? `/events/${id}` : '/events', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      navigate('/admin/events')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pertunjukan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-bold text-dark">
          {isEdit ? 'Edit Pertunjukan' : 'Tambah Pertunjukan Baru'}
        </h2>
        <p className="text-dark/65">
          Form ini menyesuaikan payload backend yang sudah berjalan saat ini.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Judul"
              value={form.judul}
              onChange={(event) => updateField('judul', event.target.value)}
              required
            />

            <label className="space-y-2">
              <span className="text-sm font-semibold text-dark">Kategori</span>
              <select
                className="w-full rounded-2xl border border-saffron/20 bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
                value={form.kategori}
                onChange={(event) =>
                  updateField('kategori', event.target.value as Event['kategori'])
                }
              >
                <option value="Gending Gandari">Gending Gandari</option>
                <option value="Karawitan">Karawitan</option>
                <option value="Wayang">Wayang</option>
                <option value="Tari Tradisional">Tari Tradisional</option>
              </select>
            </label>

            <div className="md:col-span-2">
              <Input
                label="Deskripsi"
                textarea
                value={form.deskripsi}
                onChange={(event) => updateField('deskripsi', event.target.value)}
                required
              />
            </div>

            <Input
              label="Tanggal"
              type="datetime-local"
              value={form.tanggal}
              onChange={(event) => updateField('tanggal', event.target.value)}
              required
            />

            <Input
              label="Kota"
              value={form.kota}
              onChange={(event) => updateField('kota', event.target.value)}
              required
            />

            <Input
              label="Lokasi"
              value={form.lokasi}
              onChange={(event) => updateField('lokasi', event.target.value)}
              required
            />

            <Input
              label="Harga"
              type="number"
              min={0}
              value={form.harga}
              onChange={(event) => updateField('harga', Number(event.target.value))}
              required
            />

            <Input
              label="Kuota"
              type="number"
              min={1}
              value={form.kuota}
              onChange={(event) => updateField('kuota', Number(event.target.value))}
              required
            />

            <Input
              label="Tiket Terjual"
              type="number"
              min={0}
              value={form.tiket_terjual}
              onChange={(event) => updateField('tiket_terjual', Number(event.target.value))}
              required
            />

            <label className="space-y-2">
              <span className="text-sm font-semibold text-dark">Status</span>
              <select
                className="w-full rounded-2xl border border-saffron/20 bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
                value={form.status}
                onChange={(event) =>
                  updateField('status', event.target.value as Event['status'])
                }
              >
                <option value="tersedia">tersedia</option>
                <option value="terbatas">terbatas</option>
                <option value="habis">habis</option>
              </select>
            </label>

            <Input
              label="Gradient Style"
              value={form.gradient_style}
              onChange={(event) => updateField('gradient_style', event.target.value)}
              placeholder="linear-gradient(135deg,#4A3218,#C8792A)"
            />

            <div className="grid gap-5 md:grid-cols-[120px_1fr] md:items-end">
              <Input
                label="Emoji"
                value={form.emoji}
                onChange={(event) => updateField('emoji', event.target.value)}
                placeholder="🎼"
              />
              <div className="space-y-2">
                <span className="text-sm font-semibold text-dark">Preview Gradient</span>
                <div
                  className="flex h-[54px] items-center justify-center rounded-2xl text-2xl shadow-inner"
                  style={{ background: previewGradient }}
                >
                  {form.emoji || '🎼'}
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-cultureRed/20 bg-cultureRed/5 px-4 py-3 text-sm text-cultureRed">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" loading={saving}>
              Simpan
            </Button>
            <Link to="/admin/events">
              <Button type="button" size="lg" variant="ghost">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
