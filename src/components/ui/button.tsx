import clsx from 'clsx'

export type ButtonSize = 'sm' | 'md'
export type ButtonShape = 'rectangle' | 'square' | 'circle'
export type ButtonVariant = 'normal' | 'primary' | 'destructive' | 'free'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  shape?: ButtonShape
  variant?: ButtonVariant
}

export function Button(props: ButtonProps) {
  const size = props.size ?? 'md'
  const shape = props.shape ?? 'rectangle'
  const variant = props.variant ?? 'normal'
  return (
    <button
      {...props}
      className={clsx(
        'outline-0 focus-visible:ring-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed not-disabled:active:scale-90 shadow-sm shadow-current/10',
        {
          'border-slate-200 bg-white not-disabled:hover:bg-slate-100 ring-slate-300 text-slate-800':
            variant === 'normal',
          'border-slate-900 bg-slate-800 not-disabled:hover:bg-slate-900 ring-slate-950 text-slate-200':
            variant === 'primary',
          'border-red-200 bg-white not-disabled:hover:bg-red-100 ring-red-300 text-red-800':
            variant === 'destructive',
        },
        {
          'p-1 border': size === 'sm',
          'rounded-lg': size === 'sm' && shape !== 'circle',
          'px-2': size === 'sm' && shape === 'rectangle',
          'p-2 border-2': size === 'md',
          'rounded-xl': size === 'md' && shape !== 'circle',
          'px-4': size === 'md' && shape === 'rectangle',
          'rounded-full': shape === 'circle',
        },
        props.className,
      )}
    />
  )
}
