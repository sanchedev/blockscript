import clsx from 'clsx'
import type { IconProps } from '@tabler/icons-react'
import { sectionColorMap, type SectionThemeColor } from '../../lib/theme'

interface MenuSelectorBtnProps {
  style: SectionThemeColor
  title: string
  selected?: boolean
  icon: (props: IconProps) => React.ReactNode
  onSelect?: () => void
}

export function MenuSelectorBtn({
  style,
  title,
  selected = false,
  icon: Icon,
  onSelect,
}: MenuSelectorBtnProps) {
  const { bg, border, ring, text } = sectionColorMap[style]
  const btnStyle = [text, ring, bg, border].join(' ')
  return (
    <button
      className={clsx(
        'size-16 rounded-lg border-2 outline-none focus-visible:ring-2 transition-all text-center overflow-hidden flex flex-col justify-center items-center p-1',
        selected
          ? btnStyle
          : 'not-hover:not-focus-visible:bg-white not-hover:not-focus-visible:border-slate-200 not-hover:not-focus-visible:text-slate-600 hover:shadow active:scale-95 active:shadow-none ' +
              btnStyle,
      )}
      disabled={selected}
      onClick={() => onSelect?.()}>
      {Icon != null && <Icon />}
      <div className='overflow-hidden w-full'>
        <span className='block text-[0.625rem] font-bold text-nowrap overflow-hidden text-ellipsis'>
          {title}
        </span>
      </div>
    </button>
  )
}
