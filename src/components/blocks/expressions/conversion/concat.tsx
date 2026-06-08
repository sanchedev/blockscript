import type { ConcatExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'
import clsx from 'clsx'

export function ConcatExprComp(props: ExprCompProps<ConcatExpr>) {
  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <ExprContainerComp
        container={props.expr.left}
        disabled={props.disabled}
      />
      <span>+</span>
      <ExprContainerComp
        container={props.expr.right}
        disabled={props.disabled}
      />
    </div>
  )
}
