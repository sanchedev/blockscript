import clsx from 'clsx'
import type { ExprCompProps } from '../expressions/types'
import { typeStyles } from '../../../lib/type-styles'

interface ExprBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, ExprCompProps {}

export function ExprBlock({ expr, ...props }: ExprBlockProps) {
  return (
    <div
      {...props}
      className={clsx(
        'border-l-2 rounded-xl h-fit flex flex-row items-center w-min shadow shadow-current/25',
        typeStyles(expr.type).bg,
        typeStyles(expr.type).text,
        typeStyles(expr.type).border,
        props.className,
      )}>
      <div className='p-1'>{props.children}</div>
    </div>
  )
}
