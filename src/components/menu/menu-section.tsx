import { type ReactNode, useState } from 'react'
import { Button } from '../ui/button'
import clsx from 'clsx'
import type { IconProps } from '@tabler/icons-react'
import { sectionColorMap, type SectionThemeColor } from '../../lib/theme'

export interface MenuSectionProps {
  title: string
  options: Option[]
  style: SectionThemeColor
  onSelect?: (selected: { section: string; value: string }) => void
  itemRenderer?: (item: { label: string; value: string; onSelect: () => void }) => ReactNode
}
interface Option {
  key: string
  title: string
  icon: (props: IconProps) => React.ReactNode
  items: SSOption[]
  sectionColor: SectionThemeColor
}
interface SSOption {
  label: string
  value: string
}

export function MenuSection({ options, style, onSelect, itemRenderer }: MenuSectionProps) {
  const [search, setSearch] = useState('')
  const sections = options.flatMap((sect) => {
    const items = sect.items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase()),
    )
    if (items.length === 0) return []
    return { ...sect, items }
  })

  return (
    <section className='w-full p-4 flex flex-col gap-4 overflow-auto'>
      <input
        type='text'
        className='w-full rounded-xl bg-white border-2 border-slate-200 outline-0 focus-visible:ring-2 ring-slate-300 h-9 px-4 py-2'
        placeholder='Buscar...'
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
      />
      {sections.map((section) => {
        const { bg, border, ring, text } = sectionColorMap[style]
        return (
          <section
            key={'section-list-' + section.key}
            className={`p-4 rounded-xl border-2 border-slate-100`}>
            <h2 className={`font-bol text-lg mb-1 font-bold ${text}`}>
              {section.title}
            </h2>
            <ul className='flex flex-col gap-2'>
              {section.items.map((option) => (
                <li key={'section-list-' + section.key + '-' + option.value}>
                  {itemRenderer ? (
                    itemRenderer({
                      ...option,
                      onSelect: () =>
                        onSelect?.({ section: section.key, value: option.value }),
                    })
                  ) : (
                    <Button
                      className={clsx(
                        `not-hover:not-focus-visible:bg-white not-hover:not-focus-visible:border-slate-200 w-full text-start not-disabled:active:scale-x-100 ${[
                          text,
                          ring,
                          bg,
                          border,
                        ].join(' ')}`,
                      )}
                      variant='free'
                      onClick={() =>
                        onSelect?.({ section: section.key, value: option.value })
                      }>
                      {option.label}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </section>
  )
}
