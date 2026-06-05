import type { IconProps } from '@tabler/icons-react'
import clsx from 'clsx'

export type ButtonSize = '2xs' | 'xs' | 'sm' | 'md'
export type ButtonShape = 'rectangle' | 'square' | 'circle'
export type ButtonVariant = 'normal' | 'primary' | 'destructive' | 'free'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  shape?: ButtonShape
  variant?: ButtonVariant
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
}

export function Button({
  size = 'md',
  shape = 'rectangle',
  variant = 'normal',
  icon: Icon,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'outline-0 focus-visible:ring-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed not-disabled:active:scale-90 shadow-sm shadow-current/10',
        {
          'border-slate-200 bg-white not-disabled:hover:bg-slate-100 ring-slate-300 text-slate-800':
            variant === 'normal',
          'border-slate-700 bg-slate-800 not-disabled:hover:bg-slate-900 ring-slate-950 text-slate-200':
            variant === 'primary',
          'border-red-200 bg-white not-disabled:hover:bg-red-100 ring-red-300 text-red-800':
            variant === 'destructive',
        },
        size === '2xs' &&
          clsx('h-4 p-px text-xs border', {
            'rounded-sm': shape !== 'circle',
            'px-0.5': shape === 'rectangle',
          }),
        size === 'xs' &&
          clsx('h-6 p-0.5 text-sm border', {
            'rounded-md': shape !== 'circle',
            'px-1': shape === 'rectangle',
          }),
        size === 'sm' &&
          clsx('h-8 p-1 text-sm border', {
            'rounded-lg': shape !== 'circle',
            'px-2': shape === 'rectangle',
          }),
        size === 'md' &&
          clsx('h-10 p-1.5 text-base border', {
            'rounded-xl': shape !== 'circle',
            'px-3': shape === 'rectangle',
          }),
        {
          'aspect-square': shape === 'square',
          'rounded-full': shape === 'circle',
        },
        props.className,
      )}>
      {Icon && <Icon className='size-full aspect-square text-current' />}
      {props.children}
    </button>
  )
}
