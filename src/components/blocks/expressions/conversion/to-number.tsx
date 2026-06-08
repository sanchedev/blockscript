import clsx from 'clsx'
import type { ToNumberExpr } from '../../../../lib/blocks/expressions'
import { ExprContainerComp } from '../../ui/expr-container'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'

export function ToNumberExprComp(props: ExprCompProps<ToNumberExpr>) {
  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <span>(</span>
      <ExprContainerComp
        container={props.expr.expression}
        disabled={props.disabled}
      />
      <span>)</span>
    </div>
  )
}
