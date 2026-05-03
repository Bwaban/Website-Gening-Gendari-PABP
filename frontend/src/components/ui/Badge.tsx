import { classNames } from '../../utils/helpers'

interface BadgeProps {
  value: string
  type?: 'status' | 'category' | 'neutral'
  className?: string
}

const statusClasses: Record<string, string> = {
  tersedia: 'bg-cultureGreen/10 text-cultureGreen',
  terbatas: 'bg-cultureYellow/20 text-saffron',
  habis: 'bg-cultureRed/10 text-cultureRed',
}

const categoryClasses: Record<string, string> = {
  'Gending Gandari': 'bg-saffron/10 text-saffron',
  Karawitan: 'bg-cultureGreen/10 text-cultureGreen',
  Wayang: 'bg-culturePurple/10 text-culturePurple',
  'Tari Tradisional': 'bg-cultureOlive/10 text-cultureOlive',
}

export default function Badge({
  value,
  type = 'neutral',
  className,
}: BadgeProps) {
  const classes =
    type === 'status'
      ? statusClasses[value] ?? 'bg-dark/80 text-white'
      : type === 'category'
        ? categoryClasses[value] ?? 'bg-dark/80 text-white'
        : 'bg-dark/10 text-dark'

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        classes,
        className
      )}
    >
      {value}
    </span>
  )
}
