import clsx from 'clsx'
import type { ButtonVariant } from './button'

export type MenuProps = React.HTMLAttributes<HTMLUListElement>

export function Menu(props: MenuProps) {
  return (
    <ul
      {...props}
      className={clsx(
        'absolute w-fit bg-white border-2 border-slate-200 z-10 rounded-xl text-gray-800 divide-y divide-slate-50 overflow-hidden flex flex-col',
        props.className,
      )}
    />
  )
}

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action(): void
  children?: React.ReactNode
  variant?: ButtonVariant
  textAlign?: 'start' | 'center' | 'end'
}

export function MenuItem({ action, textAlign: txt, ...props }: MenuItemProps) {
  const textAlign = txt ?? 'start'
  const variant = props.variant ?? 'normal'
  return (
    <li className='w-full'>
      <button
        {...props}
        className={clsx(
          'text-nowrap w-full px-2 py-1 outline-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-8',
          {
            'border-slate-200 bg-white not-disabled:hover:bg-slate-100 focus-visible:bg-slate-200 text-slate-800':
              variant === 'normal',
            'border-red-200 bg-white not-disabled:hover:bg-red-100 focus-visible:bg-red-200 text-red-800':
              variant === 'destructive',
          },
          {
            'text-start': textAlign === 'start',
            'text-center': textAlign === 'center',
            'text-end': textAlign === 'end',
          },
          props.className,
        )}
        onClick={() => action()}>
        <span>{props.children}</span>
      </button>
    </li>
  )
}
