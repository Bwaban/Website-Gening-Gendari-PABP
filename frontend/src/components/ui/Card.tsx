import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  className,
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-[12px] border border-[#ead7bc] bg-white shadow-panel',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
