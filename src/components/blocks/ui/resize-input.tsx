import clsx from 'clsx'
import { typeStyles } from '../../../lib/type-styles'
import type { Type } from '../../../lib/types'
import { Input } from './input'

export interface ResizeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  exprType: Type
  containerClassName?: string
}

export function ResizeInput({
  exprType,
  containerClassName,
  ...props
}: ResizeInputProps) {
  return (
    <div
      className={clsx(
        `rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 flex gap-0 w-24 min-w-12 resize-x items-center font-mono has-focus:ring-2 ${typeStyles(exprType).ring} overflow-hidden`,
        containerClassName,
      )}>
      <Input
        {...props}
        autoFocus
        autoComplete='off'
        className={clsx('p-0 outline-0 w-full', props.className)}
      />
    </div>
  )
}
