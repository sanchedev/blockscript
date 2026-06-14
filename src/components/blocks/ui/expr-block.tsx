import clsx from 'clsx'
import type { ExprId } from '../../../lib/ui/exprs'
import { typeStyles } from '../../../lib/type-styles'
import { useExprValue } from '../../../hooks/tree'

interface ExprBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  exprId: ExprId
}

export function ExprBlock({ exprId, ...props }: ExprBlockProps) {
  const [opt] = useExprValue(exprId)
  if (opt == null) return null
  return (
    <div
      {...props}
      className={clsx(
        'border-l-2 rounded-xl h-fit flex flex-row items-center w-min shadow shadow-current/25',
        typeStyles(opt.type).bg,
        typeStyles(opt.type).text,
        typeStyles(opt.type).border,
        props.className,
      )}>
      <div className='p-1'>{props.children}</div>
    </div>
  )
}
