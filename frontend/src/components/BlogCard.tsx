import { ArrowRight } from 'lucide-react'
import { BlogArticle } from '../types'

interface BlogCardProps {
  article: BlogArticle
  onReadMore: () => void
}

export default function BlogCard({ article, onReadMore }: BlogCardProps) {
  return (
    <article className="group cream-panel overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <button
        type="button"
        onClick={onReadMore}
        className="grid w-full text-left md:grid-cols-[190px_minmax(0,1fr)]"
      >
        <div className="relative h-40 w-full overflow-hidden md:h-full md:min-h-[180px]">
          {article.image ? (
            <img 
              src={article.image} 
              alt={article.judul} 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-5xl"
              style={{ background: article.gradient || 'linear-gradient(135deg, #1C1208, #C8792A)' }}
            >
              <span className="opacity-70">{article.emoji || '🎵'}</span>
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">
            {article.kategori}
          </div>
          <h3 className="mt-3 font-display text-[2rem] font-bold leading-tight text-dark">
            {article.judul}
          </h3>
          <p className="mt-4 text-sm leading-7 text-dark/65">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-dark/68">
            <span className="font-semibold text-dark">{article.author}</span>
            <span>•</span>
            <span>{article.tanggal}</span>
            <span>•</span>
            <span>{article.readTime} menit baca</span>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 font-semibold text-saffron">
            Baca
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </button>
    </article>
  )
}
