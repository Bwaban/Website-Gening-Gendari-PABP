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
  {
    name: 'Aria Muhammad Fahlevi',
    nim: '247006111131',
    role: 'Member',
    image: '/images/tim/aria.jpeg',
  },
  {
    name: 'Dwiki Muhammad Wasfi',
    nim: '247006111136',
    role: 'Member',
    image: '/images/tim/dwiki.jpeg',
  },
  {
    name: 'Rafa Ahza Naufal',
    nim: '247006111135',
    role: 'Member',
    image: '/images/tim/rafa.jpeg',
  },
  {
    name: 'Raya Alfareza Alban',
    nim: '247006111133',
    role: 'Member',
    image: '/images/tim/raya.jpeg',
  },
  {
    name: 'Zain Kautsar Ridha',
    nim: '247006111153',
    role: 'Member',
    image: '/images/tim/zain.jpeg',
  },
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
        image="/images/aboutimage/1.jpg"
      />

      <section className="bg-white">
        <SplitFeatureSection
          label="Visi Kami"
          title="Menjadi Rumah Digital Seni Budaya Indonesia"
          description={[
            'Kami bercita-cita menjadi platform terdepan dalam ekosistem seni pertunjukan tradisional Indonesia.',
            'Tempat di mana Gending Gandari, karawitan, dan ragam seni Nusantara lain dirayakan, dipasarkan, dan diwariskan dengan hangat melalui pengalaman digital yang tetap menghormati akar budaya.',
          ]}
          image="/images/aboutimage/2.jpg"
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
        image="/images/aboutimage/3.jpg"
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

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {team.map((member) => (
              <div key={member.name} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-dark/5 transition-all hover:-translate-y-1 hover:shadow-lg text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-saffron/20 bg-saffron/10 p-1">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-dark">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold text-dark/72">{member.nim}</p>
                <p className="mt-1 text-sm font-medium text-gold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark py-16 text-white sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1208] to-[#4A3218] opacity-90"></div>
        <div className="container-page text-center relative z-10">
          <h2 className="font-display text-4xl font-bold sm:text-5xl text-gold text-shadow-sm">Bergabunglah Bersama Kami</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90 font-medium">
            Mari bersama-sama melestarikan seni dan budaya Indonesia untuk generasi mendatang.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button className="bg-gold text-dark border-0 hover:bg-saffron hover:text-white font-bold transition-colors">Jelajahi Pertunjukan</Button>
            </Link>
            <Link to="/kontak">
              <Button variant="secondary" className="border-gold text-gold hover:bg-gold/10 font-bold transition-colors">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
