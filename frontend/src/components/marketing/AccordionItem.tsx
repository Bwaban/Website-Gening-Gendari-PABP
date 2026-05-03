import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { classNames } from '../../utils/helpers'

interface AccordionItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="cream-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-dark">{question}</span>
        <ChevronRight
          className={classNames(
            'h-5 w-5 shrink-0 text-saffron transition-transform duration-300',
            open && 'rotate-90'
          )}
        />
      </button>
      <div
        className={classNames(
          'grid transition-all duration-300',
          open ? 'grid-rows-[1fr] border-t border-[#ead7bc]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 py-4 text-sm leading-7 text-dark/72">{answer}</p>
        </div>
      </div>
    </div>
  )
}
