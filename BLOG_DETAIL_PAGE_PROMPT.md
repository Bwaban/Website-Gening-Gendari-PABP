# 📰 BLOG DETAIL PAGE — PENAMBAHAN PROMPT

> **Prompt ini untuk menambahkan fitur Blog Detail Page ke project SeniLokal Frontend.**
> Ketika tombol "Baca Selengkapnya" diklik di halaman Blog, user akan diarahkan ke halaman detail artikel lengkap.

---

## 🎯 KONTEKS

- Project sudah memiliki halaman `/blog` dengan 3 artikel statis
- Halaman blog menampilkan card artikel dengan tombol "Baca Selengkapnya"
- Sekarang perlu menambahkan halaman detail artikel yang muncul saat tombol diklik
- Data artikel tetap bersifat statis (hardcoded), belum perlu API

---

## 🗂️ STRUKTUR FILE BARU

```
frontend/src/
├── pages/
│   ├── BlogPage.tsx          ← SUDAH ADA (update)
│   └── BlogDetailPage.tsx    ← BUAT BARU
│
├── components/
│   └── BlogCard.tsx          ← UPDATE (tambah onClick)
│
└── data/
    └── blog.ts               ← CREATE (pindahkan data statis)
```

---

## 📝 DATA ARTIKEL LENGKAP (`src/data/blog.ts`)

> Buat file baru untuk menyimpan semua data artikel statis

```ts
export interface BlogArticle {
  id: string
  judul: string
  kategori: 'Budaya' | 'Edukasi' | 'Tips'
  tanggal: string // format: "20 April 2026"
  author: string
  excerpt: string
  content: string // artikel lengkap
  image: string // URL gambar header artikel
  readTime: number // estimasi waktu baca dalam menit
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'gending-gandari-warisan',
    judul: 'Gending Gandari: Warisan Melodi Sunda yang Tak Lekang Waktu',
    kategori: 'Budaya',
    tanggal: '20 April 2026',
    author: 'Rina Maharani',
    excerpt: 'Gending Gandari adalah salah satu bentuk musik tradisional yang menyimpan kekayaan budaya Sunda...',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
    readTime: 8,
    content: `
      <h2>Apa itu Gending Gandari?</h2>
      <p>
        Gending Gandari adalah salah satu bentuk musik tradisional yang menyimpan kekayaan budaya Sunda. 
        Musik ini telah berkembang selama berabad-abad dan menjadi bagian integral dari kehidupan masyarakat Sunda, 
        khususnya di daerah Jawa Barat.
      </p>
      
      <h2>Sejarah dan Asal-Usul</h2>
      <p>
        Gending Gandari bermula dari tradisi musik istana Sunda pada abad ke-13. Dahulu, musik ini hanya dimainkan 
        di kalangan bangsawan dan digunakan dalam upacara-upacara penting. Seiring berjalannya waktu, musik ini 
        menyebar ke kalangan rakyat biasa dan menjadi bagian dari budaya populer.
      </p>
      <p>
        Nama "Gandari" sendiri diduga berasal dari kata "gandur" yang dalam bahasa Sunda berarti "bergetar" atau 
        "berbunyi merdu". Ini menggambarkan karakteristik suara musik yang dihasilkan dari alat-alat musik tradisional.
      </p>
      
      <h2>Alat-Alat Musik Pengiring</h2>
      <p>
        Gending Gandari umumnya dimainkan dengan alat musik tradisional seperti:
      </p>
      <ul>
        <li><strong>Kacapi Suling</strong> - alat musik gesek dengan nada yang lembut dan merdu</li>
        <li><strong>Suling Bambu</strong> - menghasilkan melodi utama yang indah</li>
        <li><strong>Gong dan Kendang</strong> - memberikan irama dasar dan tempo</li>
        <li><strong>Jaipongan Drums</strong> - percussian pendamping yang energik</li>
      </ul>
      
      <h2>Karakteristik Musik</h2>
      <p>
        Musik Gending Gandari memiliki karakteristik unik yang membedakannya dari musik tradisional lainnya:
      </p>
      <ul>
        <li>Melodi yang lembut namun penuh ekspresif</li>
        <li>Tempo yang dapat disesuaikan dengan kebutuhan</li>
        <li>Harmoni yang kompleks tapi mudah didengar</li>
        <li>Improvisasi yang memberikan kebebasan kepada pemain</li>
        <li>Lirik yang sarat makna filosofis</li>
      </ul>
      
      <h2>Fungsi dalam Masyarakat Sunda</h2>
      <p>
        Hingga saat ini, Gending Gandari masih memainkan peran penting dalam berbagai acara budaya Sunda:
      </p>
      <ul>
        <li><strong>Upacara Adat</strong> - dimainkan dalam perayaan pernikahan, khitanan, dan acara keluarga</li>
        <li><strong>Pertunjukan Seni</strong> - menjadi bagian dari festival budaya dan acara seni</li>
        <li><strong>Hiburan Sosial</strong> - digunakan dalam acara ngerumpi atau berkumpul bersama</li>
        <li><strong>Pendidikan</strong> - diajarkan di sekolah-sekolah untuk melestarikan warisan budaya</li>
      </ul>
      
      <h2>Pelestarian untuk Generasi Mendatang</h2>
      <p>
        Meskipun dihadapi tantangan modernisasi, upaya-upaya pelestarian Gending Gandari terus dilakukan. 
        Platform digital seperti SeniLokal memainkan peran penting dalam memperkenalkan musik tradisional ini 
        kepada generasi muda dan pecinta budaya di seluruh dunia.
      </p>
      <p>
        Dengan memahami dan menghargai kekayaan musik tradisional seperti Gending Gandari, kita turut berkontribusi 
        dalam menjaga identitas budaya Indonesia agar tetap hidup dan relevan di era modern.
      </p>
      
      <h2>Kesimpulan</h2>
      <p>
        Gending Gandari bukan sekadar musik tradisional. Ia adalah warisan melodi Sunda yang mencerminkan jiwa, 
        nilai-nilai, dan kehidupan masyarakat Sunda selama berabad-abad. Mendengarkan dan mempelajari musik ini 
        adalah cara kita untuk terhubung dengan masa lalu sambil menciptakan masa depan yang lebih kaya akan budaya.
      </p>
    `
  },
  
  {
    id: 'karawitan-musik-jawa',
    judul: 'Mengenal Karawitan: Seni Musik Jawa yang Penuh Makna',
    kategori: 'Edukasi',
    tanggal: '15 April 2026',
    author: 'Dimas Pratama',
    excerpt: 'Karawitan merupakan seni musik gamelan Jawa yang telah hidup selama berabad-abad...',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=400&fit=crop',
    readTime: 10,
    content: `
      <h2>Pengenalan Karawitan</h2>
      <p>
        Karawitan adalah seni musik gamelan Jawa yang telah hidup selama berabad-abad dalam kehidupan masyarakat Jawa. 
        Istilah "karawitan" berasal dari kata "rawit" yang berarti "halus" atau "rumit", menunjukkan kompleksitas dan 
        keindahan musik yang dihasilkan.
      </p>
      
      <h2>Unsur-Unsur Orkestra Gamelan</h2>
      <p>
        Orkestra gamelan Jawa terdiri dari berbagai jenis instrumen yang harmonis:
      </p>
      <ul>
        <li><strong>Saron, Peking, Demung</strong> - instrumen bernada dari logam</li>
        <li><strong>Gong, Kempul</strong> - pemberi aksen dan struktur ritme</li>
        <li><strong>Kendang</strong> - pengendali tempo dan dinamika</li>
        <li><strong>Rebab, Suling</strong> - pemberi melodi utama</li>
        <li><strong>Bonang, Gender</strong> - pengisi harmoni dan ornamen</li>
      </ul>
      
      <h2>Jenis-Jenis Laras (Tangga Nada)</h2>
      <p>
        Karawitan menggunakan sistem tangga nada yang berbeda dari musik barat. Dua jenis laras utama adalah:
      </p>
      <ul>
        <li><strong>Laras Slendro</strong> - lima nada dalam satu oktaf, menghasilkan suara yang penuh dan dalam</li>
        <li><strong>Laras Pelog</strong> - tujuh nada dalam satu oktaf, menghasilkan suara yang lebih bervariasi</li>
      </ul>
      
      <h2>Fungsi dalam Wayang Kulit</h2>
      <p>
        Karawitan memiliki peran krusial dalam pertunjukan wayang kulit. Musik ini tidak hanya memberikan 
        hiburan, tetapi juga:
      </p>
      <ul>
        <li>Membimbing emosi penonton</li>
        <li>Mengeset suasana setiap scene pertunjukan</li>
        <li>Menandai pergantian adegan</li>
        <li>Memperkuat narasi cerita</li>
      </ul>
      
      <h2>Pembelajaran Karawitan</h2>
      <p>
        Untuk mempelajari karawitan, diperlukan dedikasi dan waktu yang panjang. Proses pembelajaran biasanya melibatkan:
      </p>
      <ul>
        <li>Mendengarkan dengan seksama untuk mengembangkan kepekaan telinga</li>
        <li>Berlatih memainkan satu instrumen secara mendalam</li>
        <li>Memahami aturan-aturan musik dan makna setiap gending</li>
        <li>Berkolaborasi dengan musisi lain dalam ensemble</li>
      </ul>
      
      <h2>Nilai Filosofis</h2>
      <p>
        Di balik keindahan suaranya, karawitan menyimpan nilai-nilai filosofis Jawa yang mendalam. 
        Musik ini mengajarkan tentang keseimbangan, harmoni, dan kesederhanaan yang penuh makna.
      </p>
      
      <h2>Konservasi Karawitan di Era Modern</h2>
      <p>
        Meskipun menghadapi tantangan globalisasi, karawitan terus dilestarikan melalui:
      </p>
      <ul>
        <li>Pendidikan formal di sekolah dan universitas</li>
        <li>Pertunjukan regular di berbagai acara budaya</li>
        <li>Dokumentasi dan penelitian akademik</li>
        <li>Platform digital yang memudahkan akses pembelajaran</li>
      </ul>
      
      <h2>Penutup</h2>
      <p>
        Karawitan adalah harta karun budaya Indonesia yang perlu terus dijaga dan diwariskan ke generasi mendatang. 
        Dengan memahami kedalaman seni musik Jawa ini, kita bisa lebih menghargai warisan budaya kita sendiri.
      </p>
    `
  },
  
  {
    id: '5-pertunjukan-wayang',
    judul: '5 Pertunjukan Wayang yang Wajib Kamu Saksikan',
    kategori: 'Tips',
    tanggal: '10 April 2026',
    author: 'Sari Dewi',
    excerpt: 'Wayang bukan sekadar hiburan, melainkan medium penyampaian pesan moral dan nilai-nilai luhur budaya...',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&h=400&fit=crop',
    readTime: 7,
    content: `
      <h2>Pengenalan Seni Wayang</h2>
      <p>
        Wayang bukan sekadar hiburan, melainkan medium penyampaian pesan moral dan nilai-nilai luhur budaya Nusantara. 
        Seni ini telah menjadi bagian integral dari kehidupan masyarakat Indonesia selama ribuan tahun.
      </p>
      
      <h2>Jenis-Jenis Wayang</h2>
      <p>
        Sebelum membahas pertunjukan yang wajib ditonton, mari kenal lebih dekat jenis-jenis wayang:
      </p>
      <ul>
        <li><strong>Wayang Kulit</strong> - menggunakan boneka kulit yang disilhouette dengan cahaya</li>
        <li><strong>Wayang Golek</strong> - boneka kayu berdimensi tiga dengan pakaian yang berwarna-warni</li>
        <li><strong>Wayang Orang</strong> - pertunjukan menggunakan aktor manusia</li>
        <li><strong>Wayang Beber</strong> - menggunakan gulungan kertas/kain dengan gambaran cerita</li>
      </ul>
      
      <h2>5 Pertunjukan Wayang Wajib Saksikan</h2>
      
      <h3>1. Wayang Kulit Ramayana di Solosudo</h3>
      <p>
        Pertunjukan klasik yang menampilkan cerita Ramayana dengan dalang berpengalaman. Suasana intim dan musik 
        gamelan yang merdu membuat pengalaman menonton menjadi tak terlupakan. Cocok untuk pemula yang ingin 
        mengenal wayang kulit.
      </p>
      
      <h3>2. Wayang Golek Sundanese: Pertunjukan Lakon Pajajaran</h3>
      <p>
        Wayang golek dari Jawa Barat dengan cerita tentang kerajaan Pajajaran. Boneka-boneka yang colorful dan 
        cerita yang menghibur membuat pertunjukan ini cocok untuk segala usia. Musik Sunda yang merdu mengiringi 
        setiap adegan.
      </p>
      
      <h3>3. Wayang Orang: Pertunjukan Mahabharata di Yogyakarta</h3>
      <p>
        Pertunjukan yang menggunakan aktor manusia menampilkan cerita Mahabharata dengan kostum dan tata panggung 
        yang spektakuler. Kombinasi tari, drama, dan musik menciptakan pengalaman seni yang komprehensif.
      </p>
      
      <h3>4. Wayang Kulit Modern: Reinterpretasi Cerita Kontemporer</h3>
      <p>
        Dalang-dalang muda kini menghadirkan cerita wayang yang direinterpretasi dengan isu-isu kontemporer. 
        Tetap mempertahankan esensi wayang, tetapi dengan relevance terhadap kehidupan modern. Sangat menarik 
        untuk pemuda yang ingin mencintai tradisi.
      </p>
      
      <h3>5. Wayang Beber: Cerita Visual yang Langka</h3>
      <p>
        Pertunjukan wayang beber sangat langka dan jarang ditampilkan. Jika ada kesempatan, jangan lewatkan 
        untuk menyaksikan seni yang hampir punah ini. Cerita divisualisasikan melalui gambaran pada kain yang 
        digelar, diikuti narasi dan musik.
      </p>
      
      <h2>Tips Menonton Wayang</h2>
      <ul>
        <li><strong>Datang tepat waktu</strong> - pertunjukan biasanya dimulai tepat waktu</li>
        <li><strong>Pelajari cerita sebelumnya</strong> - ini akan membuat pengalaman lebih bermakna</li>
        <li><strong>Siapkan telinga Anda</strong> - dengarkan baik-baik dialog dan musik pengiring</li>
        <li><strong>Perhatikan gerakan boneka</strong> - setiap gerakan memiliki makna</li>
        <li><strong>Habiskan durasi penuh</strong> - cerita wayang sering panjang, tetapi setiap bagian penting</li>
      </ul>
      
      <h2>Dimana Menonton Wayang?</h2>
      <p>
        Anda bisa menonton wayang di berbagai tempat:
      </p>
      <ul>
        <li>Teater dan gedung pertunjukan tradisional</li>
        <li>Festival budaya dan acara seni</li>
        <li>Sanggar seni dan sekolah tradisional</li>
        <li>Acara festival budaya dan perayaan adat</li>
        <li>Platform online yang menyediakan siaran langsung pertunjukan wayang</li>
      </ul>
      
      <h2>Kesimpulan</h2>
      <p>
        Menyaksikan wayang adalah pengalaman yang kaya akan nilai budaya dan hiburan. Dengan memahami dan 
        menghargai seni tradisional ini, kita turut dalam upaya preservasi warisan budaya bangsa Indonesia.
      </p>
    `
  }
]
```

---

## 🗺️ ROUTING UPDATE (`src/App.tsx`)

```tsx
// Tambahkan route baru:
import BlogDetailPage from '@/pages/BlogDetailPage'

const routes = [
  // ... route lainnya
  
  // PUBLIC
  {
    path: '/blog',
    element: <BlogPage />
  },
  {
    path: '/blog/:id',  // ← ROUTE BARU
    element: <BlogDetailPage />
  },
  
  // ... route lainnya
]
```

---

## 📰 BLOG PAGE UPDATE (`src/pages/BlogPage.tsx`)

**Perubahan minimal pada halaman Blog:**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BLOG_ARTICLES } from '@/data/blog'
import BlogCard from '@/components/BlogCard'

export default function BlogPage() {
  const navigate = useNavigate()

  const handleReadMore = (articleId: string) => {
    navigate(`/blog/${articleId}`)  // ← TAMBAHKAN INI
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header section sama seperti sebelumnya */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
        {BLOG_ARTICLES.map((article) => (
          <BlogCard
            key={article.id}
            article={article}
            onReadMore={() => handleReadMore(article.id)}  // ← PASS HANDLER INI
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 🎨 BLOG CARD COMPONENT UPDATE (`src/components/BlogCard.tsx`)

```tsx
import { BlogArticle } from '@/data/blog'
import Button from '@/components/ui/Button'

interface BlogCardProps {
  article: BlogArticle
  onReadMore: () => void  // ← TAMBAH PROP INI
}

export default function BlogCard({ article, onReadMore }: BlogCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
      {/* Card header dengan gradient */}
      <div
        className="h-40 flex items-center justify-center text-5xl font-bold text-white"
        style={{
          background: 'linear-gradient(135deg, #1A1208, #C8792A)'
        }}
      >
        {article.kategori === 'Budaya' && '🎼'}
        {article.kategori === 'Edukasi' && '📚'}
        {article.kategori === 'Tips' && '💡'}
      </div>

      {/* Card body */}
      <div className="p-6">
        {/* Kategori badge */}
        <span className="text-xs font-semibold uppercase tracking-wide text-saffron">
          {article.kategori}
        </span>

        {/* Judul */}
        <h3 className="font-display text-xl font-bold text-dark mt-2 mb-2 line-clamp-2">
          {article.judul}
        </h3>

        {/* Tanggal */}
        <p className="text-sm text-gray-600 mb-3">{article.tanggal}</p>

        {/* Excerpt */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Tombol Baca Selengkapnya */}
        <Button
          variant="primary"
          size="md"
          onClick={onReadMore}  // ← GUNAKAN HANDLER INI
          className="w-full"
        >
          Baca Selengkapnya
        </Button>
      </div>
    </div>
  )
}
```

---

## 📄 BLOG DETAIL PAGE (`src/pages/BlogDetailPage.tsx`) — BUAT BARU

```tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BLOG_ARTICLES, BlogArticle } from '@/data/blog'
import Button from '@/components/ui/Button'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([])

  useEffect(() => {
    // Cari artikel sesuai ID
    const foundArticle = BLOG_ARTICLES.find((a) => a.id === id)
    if (!foundArticle) {
      navigate('/blog')
      return
    }

    setArticle(foundArticle)

    // Cari artikel terkait (kategori sama, exclude artikel saat ini)
    const related = BLOG_ARTICLES.filter(
      (a) => a.kategori === foundArticle.kategori && a.id !== foundArticle.id
    ).slice(0, 2)
    setRelatedArticles(related)
  }, [id, navigate])

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Image */}
      <div className="w-full h-96 bg-gray-300 overflow-hidden">
        <img
          src={article.image}
          alt={article.judul}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/blog')}
            className="hover:text-saffron transition"
          >
            Blog
          </button>
          <span>/</span>
          <span className="text-dark font-semibold">{article.kategori}</span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-300">
          <span className="inline-block bg-saffron text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {article.kategori}
          </span>
          <span className="text-sm text-gray-600">{article.tanggal}</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-600">{article.readTime} min read</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-600">By {article.author}</span>
        </div>

        {/* Judul Artikel */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-dark mb-8 leading-tight">
          {article.judul}
        </h1>

        {/* Konten Artikel */}
        <div
          className="prose prose-lg max-w-none mb-12 font-body text-gray-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            '--tw-prose-headings': '#1A1208',
            '--tw-prose-links': '#C8792A',
            '--tw-prose-bold': '#1A1208',
          } as React.CSSProperties}
        />

        {/* Author Info */}
        <div className="bg-white rounded-lg p-6 mb-12 border-l-4 border-saffron">
          <p className="text-sm text-gray-600 mb-1">Ditulis oleh</p>
          <h3 className="font-display text-xl font-bold text-dark">{article.author}</h3>
          <p className="text-sm text-gray-500 mt-2">
            Penulis dan content creator yang bersemangat tentang seni dan budaya Indonesia.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-12">
          <Button
            variant="secondary"
            onClick={() => navigate('/blog')}
            className="flex-1"
          >
            ← Kembali ke Blog
          </Button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-300">
            <h2 className="font-display text-3xl font-bold text-dark mb-8">
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relArticle) => (
                <div
                  key={relArticle.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/blog/${relArticle.id}`)}
                >
                  <div className="h-40 bg-gray-300 flex items-center justify-center text-4xl">
                    {relArticle.kategori === 'Budaya' && '🎼'}
                    {relArticle.kategori === 'Edukasi' && '📚'}
                    {relArticle.kategori === 'Tips' && '💡'}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-saffron uppercase">
                      {relArticle.kategori}
                    </span>
                    <h3 className="font-display text-lg font-bold text-dark mt-2 mb-2 line-clamp-2">
                      {relArticle.judul}
                    </h3>
                    <p className="text-sm text-gray-600">{relArticle.tanggal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🎯 PROSE STYLING (Tailwind)

**Opsional: Jika ingin styling prose yang lebih baik, tambahkan ke `tailwind.config.js`:**

```js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // ... config lainnya
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1208',
            h2: {
              color: '#1A1208',
              fontFamily: '"Playfair Display", serif',
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            h3: {
              color: '#1A1208',
              fontFamily: '"Playfair Display", serif',
              fontWeight: '700',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            },
            p: {
              marginBottom: '1rem',
              lineHeight: '1.75'
            },
            ul: {
              marginBottom: '1rem'
            },
            li: {
              marginBottom: '0.5rem',
              color: '#1A1208'
            },
            a: {
              color: '#C8792A',
              textDecoration: 'underline',
              '&:hover': {
                color: '#D4A843'
              }
            },
            strong: {
              color: '#1A1208',
              fontWeight: '700'
            }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
```

**Install plugin typography:**
```bash
npm install -D @tailwindcss/typography
```

---

## 🔧 TYPE UPDATE (`src/types/index.ts`)

```ts
// Tambahkan type untuk article
export interface BlogArticle {
  id: string
  judul: string
  kategori: 'Budaya' | 'Edukasi' | 'Tips'
  tanggal: string
  author: string
  excerpt: string
  content: string // HTML string
  image: string
  readTime: number
}
```

---

## 📋 CHECKLIST IMPLEMENTASI

- [ ] Buat file `src/data/blog.ts` dengan semua data artikel
- [ ] Buat file `src/pages/BlogDetailPage.tsx` (copy dari prompt)
- [ ] Update `src/pages/BlogPage.tsx` untuk menambah handler `onReadMore`
- [ ] Update `src/components/BlogCard.tsx` untuk accept `onReadMore` prop
- [ ] Update `src/App.tsx` untuk tambah route `/blog/:id`
- [ ] Update `src/types/index.ts` untuk tambah interface `BlogArticle`
- [ ] Install Tailwind CSS plugin `@tailwindcss/typography` (opsional tapi recommended)
- [ ] Update `tailwind.config.js` untuk typography styling (opsional)
- [ ] Test: klik "Baca Selengkapnya" → redirect ke detail article
- [ ] Test: klik artikel terkait → update konten halaman
- [ ] Test: klik "Kembali ke Blog" → kembali ke halaman blog

---

## 🎨 STYLING NOTES

- Background halaman: `bg-cream` (#FDF6E3)
- Judul utama: `font-display text-4xl md:text-5xl font-bold`
- Konten: `font-body` untuk readability optimal
- Accent color: `text-saffron` (#C8792A)
- Card shadow: `shadow-md hover:shadow-lg transition`

---

## ⚡ FITUR BONUS (Optional)

Jika ingin lebih advanced, bisa tambahkan:

1. **Reading Progress Bar** — bar di atas halaman menunjukkan progress membaca
2. **Table of Contents** — auto-generated dari h2/h3 di konten
3. **Comment Section** — form komentar sederhana (local state)
4. **Share Buttons** — tombol share ke social media
5. **Analytics** — track artikel paling populer
6. **Search Articles** — search dalam semua artikel

---

## 🚀 KESIMPULAN

Dengan implementasi ini, setiap klik "Baca Selengkapnya" akan membawa user ke halaman detail artikel yang lengkap dengan:
- Hero image
- Meta info (kategori, tanggal, author, read time)
- Konten artikel utuh dengan formatting yang baik
- Sidebar artikel terkait
- Navigation breadcrumb
- Smooth transition antar artikel

Semua tetap **statis** (tidak perlu API baru) dan fully **responsive** untuk semua device! ✨