import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { classNames } from '../../utils/helpers'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
}

const variantMap = {
  primary:
    'bg-saffron text-white hover:bg-gold focus-visible:ring-saffron/30 shadow-lg shadow-saffron/20',
  secondary:
    'border border-saffron bg-transparent text-saffron hover:bg-saffron/10 focus-visible:ring-saffron/20',
  danger:
    'bg-cultureRed text-white hover:bg-cultureRed/90 focus-visible:ring-cultureRed/20',
  ghost:
    'bg-transparent text-dark hover:bg-dark/5 focus-visible:ring-dark/10',
}

const sizeMap = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm sm:text-base',
  lg: 'h-12 px-6 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    fullWidth = false,
    leftIcon,
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variantMap[variant],
        sizeMap[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner size="sm" className="border-current" /> : leftIcon}
      <span>{children}</span>
    </button>
  )
})

export default Button
