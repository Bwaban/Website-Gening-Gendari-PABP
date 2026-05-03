import type { ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

interface PageHeroProps {
  badge: string
  title: ReactNode
  description: string
  variant?: 'dark' | 'pink' | 'saffron'
}

const variantMap = {
  dark: 'hero-pattern bg-dark text-white',
  pink: 'pink-pattern bg-pink text-white',
  saffron: 'saffron-pattern bg-saffron text-white',
}

export default function PageHero({
  badge,
  title,
  description,
  variant = 'dark',
}: PageHeroProps) {
  return (
    <section className={classNames('overflow-hidden border-b border-saffron/20', variantMap[variant])}>
      <div className="container-page py-16 text-center sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-gold/70 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            {badge}
          </div>
          <div className="mt-6 font-display text-4xl font-bold leading-tight sm:text-6xl">
            {title}
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
