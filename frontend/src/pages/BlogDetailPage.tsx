import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { BLOG_ARTICLES } from '../data/blog'
import type { BlogArticle } from '../types'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([])

  useEffect(() => {
    const foundArticle = BLOG_ARTICLES.find((item) => item.id === id)

    if (!foundArticle) {
      navigate('/blog')
      return
    }

    setArticle(foundArticle)
    setRelatedArticles(
      BLOG_ARTICLES.filter(
        (item) => item.kategori === foundArticle.kategori && item.id !== foundArticle.id
      ).slice(0, 2)
    )
  }, [id, navigate])

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-dark/60">Memuat artikel...</p>
      </div>
    )
  }

  return (
    <div className="page-shell min-h-screen bg-cream">
      <div className="h-[320px] overflow-hidden bg-dark sm:h-[420px]">
        <img src={article.image} alt={article.judul} className="h-full w-full object-cover" />
      </div>

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-dark/60">
            <button type="button" onClick={() => navigate('/blog')} className="transition hover:text-saffron">
              Blog
            </button>
            <span>/</span>
            <span className="font-semibold text-dark">{article.kategori}</span>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-[#e6d4b8] pb-6 text-sm text-dark/65">
            <span className="rounded-full bg-saffron px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {article.kategori}
            </span>
            <span>{article.tanggal}</span>
            <span>•</span>
            <span>{article.readTime} menit baca</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight text-dark sm:text-6xl">
            {article.judul}
          </h1>

          <div
            className="prose prose-lg mt-8 max-w-none font-body text-dark"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={
              {
                '--tw-prose-headings': '#1C1208',
                '--tw-prose-links': '#C8792A',
                '--tw-prose-bold': '#1C1208',
              } as CSSProperties
            }
          />

          <div className="mt-12 rounded-[12px] border-l-4 border-saffron bg-white p-6 shadow-panel">
            <p className="text-sm text-dark/60">Ditulis oleh</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-dark">{article.author}</h3>
            <p className="mt-2 text-sm leading-7 text-dark/65">
              Penulis dan kurator konten yang bersemangat mengangkat seni serta budaya Indonesia ke ruang digital yang lebih hangat.
            </p>
          </div>

          <div className="mt-8">
            <Button variant="secondary" onClick={() => navigate('/blog')}>
              Kembali ke Blog
            </Button>
          </div>

          {relatedArticles.length ? (
            <div className="mt-16 border-t border-[#e6d4b8] pt-12">
              <h2 className="font-display text-4xl font-bold text-dark">Artikel Terkait</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {relatedArticles.map((relatedArticle) => (
                  <button
                    type="button"
                    key={relatedArticle.id}
                    onClick={() => navigate(`/blog/${relatedArticle.id}`)}
                    className="overflow-hidden rounded-[12px] border border-[#ead7bc] bg-white text-left shadow-panel transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div
                      className="flex h-40 items-center justify-center text-5xl"
                      style={{
                        background:
                          relatedArticle.gradient || 'linear-gradient(135deg, #1C1208, #C8792A)',
                      }}
                    >
                      <span className="opacity-70">{relatedArticle.emoji || '🎵'}</span>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron">
                        {relatedArticle.kategori}
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-dark">
                        {relatedArticle.judul}
                      </h3>
                      <p className="mt-3 text-sm text-dark/62">{relatedArticle.tanggal}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
