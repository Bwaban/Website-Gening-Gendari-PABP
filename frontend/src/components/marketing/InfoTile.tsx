import type { LucideIcon } from 'lucide-react'

interface InfoTileProps {
  icon: LucideIcon
  title: string
  content: string
}

export default function InfoTile({ icon: Icon, title, content }: InfoTileProps) {
  return (
    <div className="cream-panel p-7 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-gold text-white shadow-lg shadow-saffron/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-dark">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-dark/65">{content}</p>
    </div>
  )
}
