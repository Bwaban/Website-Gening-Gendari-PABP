import Button from './ui/Button'
import Input from './ui/Input'

export interface EventFilterValues {
  search: string
  kategori: string
  kota: string
  tanggalMulai: string
  tanggalAkhir: string
}

interface EventFilterProps {
  value: EventFilterValues
  onChange: (value: EventFilterValues) => void
  onReset: () => void
}

const categories = [
  'Semua',
  'Gending Gandari',
  'Karawitan',
  'Wayang',
  'Tari Tradisional',
]

const cities = ['Semua', 'Bandung', 'Yogyakarta', 'Jakarta', 'Solo']

export default function EventFilter({
  value,
  onChange,
  onReset,
}: EventFilterProps) {
  const update = (key: keyof EventFilterValues, nextValue: string) => {
    onChange({ ...value, [key]: nextValue })
  }

  return (
    <div className="rounded-[28px] border border-dark/10 bg-white p-5 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto]">
        <Input
          label="Cari Event"
          placeholder="Judul, lokasi, kategori..."
          value={value.search}
          onChange={(event) => update('search', event.target.value)}
        />

        <label className="space-y-2">
          <span className="text-sm font-semibold text-dark">Kategori</span>
          <select
            className="w-full rounded-2xl border border-saffron/20 bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            value={value.kategori}
            onChange={(event) => update('kategori', event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-dark">Kota</span>
          <select
            className="w-full rounded-2xl border border-saffron/20 bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            value={value.kota}
            onChange={(event) => update('kota', event.target.value)}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Tanggal Mulai"
          type="date"
          value={value.tanggalMulai}
          onChange={(event) => update('tanggalMulai', event.target.value)}
        />

        <Input
          label="Tanggal Akhir"
          type="date"
          value={value.tanggalAkhir}
          onChange={(event) => update('tanggalAkhir', event.target.value)}
        />

        <div className="flex items-end">
          <Button variant="secondary" fullWidth onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
