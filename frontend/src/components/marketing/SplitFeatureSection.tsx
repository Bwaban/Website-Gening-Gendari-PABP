import { classNames } from '../../utils/helpers'

interface SplitFeatureSectionProps {
  label: string
  title: string
  description: string[]
  emoji: string
  gradient: string
  reverse?: boolean
}

export default function SplitFeatureSection({
  label,
  title,
  description,
  emoji,
  gradient,
  reverse = false,
}: SplitFeatureSectionProps) {
  return (
    <section className="py-14 sm:py-20">
      <div
        className={classNames(
          'container-page grid gap-12 lg:grid-cols-2 lg:items-center',
          reverse && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
        )}
      >
        <div className="space-y-4">
          <p className="soft-label">{label}</p>
          <h2 className="section-title max-w-xl">{title}</h2>
          <div className="space-y-4">
            {description.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-base leading-8 text-dark/72">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          className="flex min-h-[280px] items-center justify-center rounded-[14px] shadow-panel sm:min-h-[360px]"
          style={{ background: gradient }}
        >
          <div className="text-7xl opacity-70 sm:text-8xl">{emoji}</div>
        </div>
      </div>
    </section>
  )
}
