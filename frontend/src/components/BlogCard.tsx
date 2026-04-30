import { BlogArticle } from '../types'
import Button from './ui/Button'

interface BlogCardProps {
  article: BlogArticle
  onReadMore: () => void
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
          onClick={onReadMore}
          className="w-full"
        >
          Baca Selengkapnya
        </Button>
      </div>
    </div>
  )
}
