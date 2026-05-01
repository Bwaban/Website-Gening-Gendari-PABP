import { useNavigate } from 'react-router-dom'
import { BLOG_ARTICLES } from '../data/blog'
import BlogCard from '../components/BlogCard'

export default function BlogPage() {
  const navigate = useNavigate()

  const handleReadMore = (articleId: string) => {
    navigate(`/blog/${articleId}`)
  }

  return (
    <div className="py-14 bg-cream min-h-screen">
      <div className="container-page space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-saffron">
            Blog SeniLokal
          </p>
          <h1 className="section-title">Cerita, wawasan, dan inspirasi seni budaya Indonesia</h1>
          <p className="section-copy mx-auto">
            Halaman ini memuat artikel, tips, dan wawasan seputar ekosistem pertunjukan SeniLokal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
          {BLOG_ARTICLES.map((article) => (
            <BlogCard
              key={article.id}
              article={article}
              onReadMore={() => handleReadMore(article.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
