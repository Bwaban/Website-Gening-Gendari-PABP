import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const articles = [
  {
    id: 1,
    title: 'Gending Gandari: Warisan Melodi Sunda yang Tak Lekang Waktu',
    category: 'Budaya',
    date: '20 April 2026',
    excerpt:
      'Gending Gandari adalah salah satu bentuk musik tradisional yang menyimpan lapisan rasa, ritme, dan nilai spiritual dalam setiap lantunannya.',
    content:
      'Gending Gandari tumbuh dari akar budaya Sunda yang kuat. Keindahannya tidak hanya terletak pada komposisi musikal, tetapi juga pada perannya sebagai penghubung memori kolektif masyarakat. Melalui platform digital seperti SeniLokal, pertunjukan ini dapat menjangkau penonton baru tanpa kehilangan karakter aslinya.',
  },
  {
    id: 2,
    title: 'Mengenal Karawitan: Seni Musik Jawa yang Penuh Makna',
    category: 'Edukasi',
    date: '15 April 2026',
    excerpt:
      'Karawitan merupakan seni musik gamelan Jawa yang telah hidup selama berabad-abad dan terus berkembang melalui pendekatan kontemporer.',
    content:
      'Karawitan menuntut kedisiplinan ritmis sekaligus kepekaan rasa yang tinggi. Di balik struktur gamelannya, tersimpan filosofi kebersamaan dan keseimbangan. Kini banyak panggung muda memadukan karawitan dengan tata panggung modern untuk menghadirkan pengalaman yang lebih inklusif bagi generasi baru.',
  },
  {
    id: 3,
    title: '5 Pertunjukan Wayang yang Wajib Kamu Saksikan',
    category: 'Tips',
    date: '10 April 2026',
    excerpt:
      'Wayang bukan sekadar hiburan, melainkan medium penyampaian nilai, etika, dan kisah besar Nusantara yang selalu relevan.',
    content:
      'Jika baru mengenal dunia wayang, mulailah dari pertunjukan yang menonjolkan musik dan visual yang ramah penonton baru. Perhatikan lakon, dalang, serta iringan musiknya. Pengalaman menonton akan jauh lebih kaya ketika kamu memahami konteks cerita yang dibawakan di atas panggung.',
  },
]

export default function BlogPage() {
  const [openArticleId, setOpenArticleId] = useState<number | null>(articles[0].id)

  return (
    <div className="py-14">
      <div className="container-page space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            Blog SeniLokal
          </p>
          <h1 className="section-title">Cerita, wawasan, dan inspirasi seni budaya Indonesia</h1>
          <p className="section-copy mx-auto">
            Halaman ini bersifat statis dan dirancang untuk menguatkan narasi
            budaya di sekitar ekosistem pertunjukan SeniLokal.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {articles.map((article) => {
            const open = openArticleId === article.id

            return (
              <Card key={article.id} className="flex h-full flex-col">
                <div className="mb-5 rounded-[28px] bg-gradient-to-br from-dark via-[#2A1A08] to-saffron p-6 text-white">
                  <div className="text-xs uppercase tracking-[0.28em] text-gold">
                    {article.category}
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm text-white/70">{article.date}</p>
                </div>

                <p className="font-body leading-7 text-dark/75">{article.excerpt}</p>

                <div className="mt-6 flex-1 rounded-[24px] bg-cream p-5">
                  {open ? (
                    <p className="font-body leading-8 text-dark/80">{article.content}</p>
                  ) : (
                    <p className="font-body leading-8 text-dark/55">
                      Klik tombol di bawah untuk membaca konten lengkap artikel.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    variant={open ? 'secondary' : 'primary'}
                    fullWidth
                    onClick={() => setOpenArticleId(open ? null : article.id)}
                  >
                    {open ? 'Tutup Artikel' : 'Baca Selengkapnya'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
