import clsx from 'clsx'
import { IconX } from '@tabler/icons-react'
import { sidebarInfoSended } from '../lib/event/events'
import { useSidebarStore } from '../stores/sidebar-store'
import { Button } from './ui/button'
import { useState } from 'react'

export function Sidebar() {
  const [index, setIndex] = useState(0)

  const info = useSidebarStore((state) => state.info)

  if (info == null) {
    return null
  }

  const handleClose = () => {
    setIndex(0)
    sidebarInfoSended.emit(undefined)
  }
  const handleSelect = (value: string) => {
    setIndex(0)
    sidebarInfoSended.emit(value)
  }

  const selected = info.sections[index]

  return (
    <aside
      className={clsx(
        'relative w-sm border-2 m-4 rounded-xl p-4 flex flex-col gap-4 transition-colors',
        {
          'bg-slate-100 border-slate-300': selected.style == null,
          [`${selected.style?.bg} ${selected.style?.border} ${selected.style?.text}`]:
            selected.style != null,
        },
      )}>
      <Button
        aria-label='Cerrar'
        size='sm'
        shape='circle'
        className='absolute -top-2 -right-2'
        hidden={!info.optional}>
        <IconX className='size-4' onClick={handleClose} />
      </Button>
      <ul className='absolute origin-bottom-right bottom-full right-full -rotate-90 flex gap-2 items-end pr-4 max-w-[calc(100vh-2rem)] overflow-x-auto scrollbar-thumb-slate-200 scrollbar-track-slate-50'>
        {info.sections.map(({ title, style }, i) => (
          <li key={'section-' + title}>
            <button
              className={clsx(
                'min-w-20 border-2 outline-0 focus-visible:ring-2 rounded-t-xl px-4 transition-all',
                style && [style.border, style.header, style.ring].join(' '),
                style == null &&
                  'bg-white hover:bg-slate-100 border-slate-200 ring-gray-300',
                index === i ? 'h-10' : 'h-8',
              )}
              onClick={() => setIndex(i)}>
              {title}
            </button>
          </li>
        ))}
      </ul>
      <SidebarSection
        title={selected.title}
        options={selected.options}
        style={selected.style}
        onSelect={handleSelect}
      />
    </aside>
  )
}

interface SectionStyle {
  bg: string
  text: string
  border: string
  ring: string
  header: string
}

interface SidebarSectionProps {
  title: string
  options: SSOption[]
  style?: SectionStyle
  onSelect?: (value: string) => void
}
interface SSOption {
  label: string
  value: string
}

function SidebarSection({
  title,
  options,
  style,
  onSelect,
}: SidebarSectionProps) {
  return (
    <section>
      <h2 className='text-2xl px-2 py-1 rounded-lg mb-2'>{title}</h2>
      <ul className='rounded-xl p-2 flex flex-col gap-1'>
        {options.map((o) => (
          <li key={o.value}>
            <Button
              className={clsx(
                `${style?.bg} ${style?.border} ${style?.border} not-disabled:hover:brightness-95 ${style?.ring} ${style?.text} w-full text-start`,
              )}
              variant={style == null ? 'normal' : 'free'}
              onClick={() => onSelect?.(o.value)}>
              {o.label}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
