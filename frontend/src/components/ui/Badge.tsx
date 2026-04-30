import { classNames } from '../../utils/helpers'

interface BadgeProps {
  value: string
  type?: 'status' | 'category' | 'neutral'
  className?: string
}

const statusClasses: Record<string, string> = {
  tersedia: 'bg-cultureGreen text-white',
  terbatas: 'bg-cultureYellow text-white',
  habis: 'bg-cultureRed text-white',
}

const categoryClasses: Record<string, string> = {
  'Gending Gandari': 'bg-saffron text-white',
  Karawitan: 'bg-cultureGreen text-white',
  Wayang: 'bg-culturePurple text-white',
  'Tari Tradisional': 'bg-cultureOlive text-white',
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
