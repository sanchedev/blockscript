import clsx from 'clsx'
import { IconX } from '@tabler/icons-react'
import { sidebarInfoSended } from '../lib/event/events'
import { useSidebarStore } from '../stores/sidebar-store'
import { Button } from './ui/button'
import { useState } from 'react'
import type { SectionStyle } from '../lib/blocks/shared/group-types'

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
    <aside className='fixed z-30 top-16 left-0 bottom-0 w-md max-w-[100vw] flex transition-colors bg-white border-r-2 border-gray-200 shadow'>
      <Button
        aria-label='Cerrar'
        size='sm'
        shape='circle'
        className='absolute -top-2 -right-2'
        hidden={!info.optional}
        onClick={handleClose}
        icon={IconX}
      />
      <ul className='flex flex-col w-20 p-2 gap-1 h-full border-r-2 border-gray-200'>
        {info.sections.map(({ title, style, icon: Icon }, i) => (
          <li key={'section-' + title}>
            <button
              className={clsx(
                'size-16 not-hover:not-focus-visible:bg-white rounded-lg border-2 not-hover:not-focus-visible:border-slate-200 outline-none focus-visible:ring-2 transition-all text-center overflow-hidden flex flex-col justify-center items-center hover:shadow p-1 active:scale-95 active:shadow-none',
                style &&
                  [style.text, style.ring, style.bg, style.border].join(' '),
              )}
              onClick={() => setIndex(i)}>
              {Icon != null && <Icon />}
              <div className='overflow-hidden w-full'>
                <span className='block text-[0.625rem] font-bold text-nowrap overflow-hidden text-ellipsis'>
                  {title}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <SidebarSection
        key={selected.title}
        title={selected.title}
        options={selected.options}
        style={selected.style}
        onSelect={handleSelect}
      />
    </aside>
  )
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

function SidebarSection({ options, style, onSelect }: SidebarSectionProps) {
  const [search, setSearch] = useState('')

  return (
    <section className='w-full p-4 flex flex-col gap-4'>
      <input
        type='text'
        className='w-full rounded-xl bg-white border-2 border-slate-200 outline-0 focus-visible:ring-2 ring-slate-300 h-12 px-4 py-2'
        placeholder='Buscar...'
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
      />
      <ul className='flex flex-col gap-2'>
        {options.map(
          (o) =>
            o.label.toLowerCase().includes(search.toLowerCase()) && (
              <li key={o.value}>
                <Button
                  className={clsx(
                    style &&
                      `not-hover:not-focus-visible:bg-white rounded-lg border-2 not-hover:not-focus-visible:border-slate-200 outline-none focus-visible:ring-2 transition-colors w-full text-start ${[
                        style.text,
                        style.ring,
                        style.bg,
                        style.border,
                      ].join(' ')}`,
                  )}
                  variant={style == null ? 'normal' : 'free'}
                  onClick={() => onSelect?.(o.value)}>
                  {o.label}
                </Button>
              </li>
            ),
        )}
      </ul>
    </section>
  )
}
