import {
  type ForwardedRef,
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { classNames } from '../../utils/helpers'

type SharedProps = {
  label: string
  error?: string
  textarea?: boolean
}

type InputProps = SharedProps &
  InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>

const baseClassName =
  'w-full rounded-2xl border border-saffron/20 bg-white px-4 py-3 text-sm text-dark shadow-sm outline-none transition placeholder:text-dark/35 focus:border-saffron focus:ring-4 focus:ring-saffron/10'

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input({ label, error, className, textarea = false, ...props }, ref) {
    return (
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-dark">{label}</span>
        {textarea ? (
          <textarea
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            className={classNames(baseClassName, 'min-h-[120px] resize-y', className)}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as ForwardedRef<HTMLInputElement>}
            className={classNames(baseClassName, className)}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error ? <span className="text-sm text-cultureRed">{error}</span> : null}
      </label>
    )
  }
)

export default Input
