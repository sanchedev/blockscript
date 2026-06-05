import type { ReadExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'
import clsx from 'clsx'

export function ReadExprComp(props: ExprCompProps<ReadExpr>) {
  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg flex items-center gap-1 px-1 h-6 font-mono shadow text-sm',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <span>leer</span>
      <ExprContainerComp container={props.expr.prompt} />
    </div>
  )
}
