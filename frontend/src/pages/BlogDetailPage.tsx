import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BLOG_ARTICLES } from '../data/blog'
import { BlogArticle } from '../types'
import Button from '../components/ui/Button'

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
