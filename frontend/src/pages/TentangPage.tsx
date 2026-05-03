import { Link } from 'react-router-dom'
import { Heart, Lightbulb, ShieldCheck, Users } from 'lucide-react'
import PageHero from '../components/marketing/PageHero'
import SplitFeatureSection from '../components/marketing/SplitFeatureSection'
import Button from '../components/ui/Button'

const values = [
  {
    title: 'Cinta Budaya',
    description:
      'Setiap keputusan kami dilandasi kecintaan mendalam terhadap seni dan budaya leluhur Indonesia.',
    icon: Heart,
  },
  {
    title: 'Kolaboratif',
    description:
      'Kami percaya pada kekuatan kolaborasi antara seniman, penonton, dan komunitas budaya.',
    icon: Users,
  },
  {
    title: 'Inovatif',
    description:
      'Kami mengintegrasikan teknologi terkini untuk memperluas jangkauan seni tradisional.',
    icon: Lightbulb,
  },
  {
    title: 'Terpercaya',
    description:
      'Transparansi dan kejujuran adalah fondasi kepercayaan yang kami bangun bersama komunitas.',
    icon: ShieldCheck,
  },
]

const stats = [
  ['500+', 'Pertunjukan Terfasilitasi'],
  ['50K+', 'Penonton Terlayani'],
  ['200+', 'Seniman Bergabung'],
  ['15+', 'Kota di Indonesia'],
]

const team = [
  ['Dwiki Muhammad', 'Founder & CEO'],
  ['Maimunah Sari', 'Head of Culture'],
  ['Rizki Pratama', 'Lead Developer'],
  ['Siti Rahma', 'Community Manager'],
]

export default function TentangPage() {
  return (
    <div className="page-shell">
      <PageHero
        badge="Tentang Kami"
        title={
          <>
            Tentang <span className="italic text-gold">SeniLokal</span>
          </>
        }
        description="Platform digital yang menghubungkan pecinta seni dengan pertunjukan seni lokal terbaik di seluruh Indonesia."
      />

      <SplitFeatureSection
        label="Misi Kami"
        title="Melestarikan Budaya, Mendukung Seniman Lokal"
        description={[
          'Kami hadir untuk menjadi jembatan antara para seniman Gending Gandari dan pecinta seni budaya di seluruh Indonesia.',
          'Dengan teknologi digital, kami mempermudah akses masyarakat terhadap pertunjukan seni karawitan dan budaya tradisional yang kaya makna, memastikan warisan luhur terus hidup dan berkembang dari generasi ke generasi.',
        ]}
        emoji="🎼"
        gradient="linear-gradient(135deg, #6A431C 0%, #C8792A 100%)"
      />

      <section className="bg-white">
        <SplitFeatureSection
          label="Visi Kami"
          title="Menjadi Rumah Digital Seni Budaya Indonesia"
          description={[
            'Kami bercita-cita menjadi platform terdepan dalam ekosistem seni pertunjukan tradisional Indonesia.',
            'Tempat di mana Gending Gandari, karawitan, dan ragam seni Nusantara lain dirayakan, dipasarkan, dan diwariskan dengan hangat melalui pengalaman digital yang tetap menghormati akar budaya.',
          ]}
          emoji="🏺"
          gradient="linear-gradient(135deg, #7E4B1D 0%, #D1842C 100%)"
          reverse
        />
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="soft-label">Yang Kami Pegang</p>
            <h2 className="section-title mt-3">Nilai-Nilai Kami</h2>
            <p className="section-copy mx-auto mt-3">
              Prinsip yang memandu setiap langkah kami dalam membangun rumah digital untuk seni tradisi.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="cream-panel p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-gold text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-dark">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-dark/68">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <SplitFeatureSection
        label="Perjalanan Kami"
        title="Cerita di Balik SeniLokal"
        description={[
          'SeniLokal lahir dari kekhawatiran akan semakin terpinggirkannya seni tradisional Indonesia di tengah arus modernisasi.',
          'Berawal dari komunitas kecil pecinta Gending Gandari di Bandung, kami membangun platform yang memudahkan semua orang untuk menemukan dan menikmati pertunjukan seni lokal.',
        ]}
        emoji="🎭"
        gradient="linear-gradient(135deg, #7B491C 0%, #C8792A 100%)"
        reverse
      />

      <section className="bg-dark py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <p className="soft-label text-gold">Pencapaian Kami</p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Dampak Kami</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/72">
            Angka-angka yang membanggakan dan terus bertumbuh bersama komunitas seni budaya Indonesia.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-[12px] border border-gold/15 bg-white/3 px-6 py-8">
                <div className="font-display text-5xl font-bold text-gold">{value}</div>
                <div className="mt-3 text-sm text-white/72">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="text-center">
            <p className="soft-label">Keluarga Kami</p>
            <h2 className="section-title mt-3">Tim Kami</h2>
            <p className="section-copy mx-auto mt-3">Orang-orang di balik SeniLokal.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {team.map(([name, role]) => (
              <div key={name} className="cream-panel p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-mid to-saffron text-3xl text-white">
                  👤
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-dark">{name}</h3>
                <p className="mt-2 text-sm text-dark/65">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="saffron-pattern bg-gradient-to-r from-saffron to-gold py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Bergabunglah Bersama Kami</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Mari bersama-sama melestarikan seni dan budaya Indonesia untuk generasi mendatang.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button className="bg-white text-saffron hover:bg-cream">Jelajahi Pertunjukan</Button>
            </Link>
            <Link to="/kontak">
              <Button variant="secondary" className="border-white text-white hover:bg-white/10">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
