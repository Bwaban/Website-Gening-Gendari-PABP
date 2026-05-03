import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BLOG_ARTICLES } from '../data/blog'
import BlogCard from '../components/BlogCard'
import PageHero from '../components/marketing/PageHero'
import Button from '../components/ui/Button'

export default function BlogPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return BLOG_ARTICLES
    return BLOG_ARTICLES.filter((article) =>
      [article.judul, article.kategori, article.author, article.excerpt]
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }, [search])

  const categories = [
    ['Gending Gandari', 12],
    ['Festival Budaya', 8],
    ['Karawitan', 15],
    ['Tari Tradisional', 6],
    ['Wayang', 9],
    ['Budaya Lokal', 11],
  ]

  const popularArticles = BLOG_ARTICLES.slice(0, 3)

  return (
    <div className="page-shell min-h-screen bg-cream">
      <PageHero
        badge="🔥 Artikel Terbaru"
        title={
          <>
            Blog & Artikel
            <br />
            <span className="italic text-gold">Cerita Seni & Budaya Indonesia</span>
          </>
        }
        description="Jelajahi artikel menarik tentang seni, budaya, dan pertunjukan tradisional Indonesia."
      />

      <section className="py-12 sm:py-16">
        <div className="container-page">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="mx-auto flex max-w-[640px] gap-3"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari artikel..."
              className="h-12 flex-1 rounded-[10px] border border-[#e8d5b5] bg-[#fffdfa] px-4 text-sm text-dark outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            />
            <Button type="submit">Cari</Button>
          </form>

          <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  onReadMore={() => navigate(`/blog/${article.id}`)}
                />
              ))}

              {!filteredArticles.length ? (
                <div className="cream-panel px-8 py-10 text-center text-dark/68">
                  Tidak ada artikel yang cocok dengan pencarian Anda.
                </div>
              ) : null}
            </div>

            <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
              <div className="cream-panel p-6">
                <h2 className="font-display text-3xl font-bold text-dark">Kategori</h2>
                <div className="mt-4 space-y-4 border-t border-saffron/50 pt-4">
                  {categories.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between gap-4 text-dark/78">
                      <span>{name}</span>
                      <span className="rounded-full bg-saffron/10 px-2.5 py-1 text-xs font-semibold text-saffron">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cream-panel p-6">
                <h2 className="font-display text-3xl font-bold text-dark">Artikel Populer</h2>
                <div className="mt-4 space-y-5 border-t border-saffron/50 pt-4">
                  {popularArticles.map((article) => (
                    <button
                      type="button"
                      key={article.id}
                      onClick={() => navigate(`/blog/${article.id}`)}
                      className="block text-left"
                    >
                      <div className="font-semibold leading-6 text-dark transition hover:text-saffron">
                        {article.judul}
                      </div>
                      <div className="mt-1 text-sm text-dark/62">{article.tanggal}</div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
