import type { Icon } from '@tabler/icons-react'
import clsx from 'clsx'

export interface ContextMenuProps {
  id: string
  options: ContextMenuOption[]
}

export interface ContextMenuOption {
  icon?: Icon
  label: string
  variant?: 'normal' | 'destructive'
  action: () => void
}

export function ContextMenu({ id, options }: ContextMenuProps) {
  return (
    <div className='absolute bottom-full mb-1 left-0 min-w-32 w-fit bg-white rounded-xl p-1 text-sm font-sans shadow animate-fade-in-up animate-duration-fast animate-ease-out'>
      {options.map((option, i) => (
        <button
          key={`${id};ctxmenu[${i}]`}
          className={clsx(
            'flex gap-1 w-full p-1 h-6 rounded-lg transition-colors bg-white',
            {
              'hover:bg-slate-100 text-slate-600':
                option.variant !== 'destructive',
              'hover:bg-red-50 text-red-700': option.variant === 'destructive',
            },
          )}
          onClick={() => option.action()}>
          {option.icon != null && <option.icon size={16} />}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )
}
