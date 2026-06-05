import clsx from 'clsx'
import type { ToBooleanExpr } from '../../../../lib/blocks/expressions'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'
import type { ExprCompProps } from '../types'

export function ToBooleanExprComp(props: ExprCompProps<ToBooleanExpr>) {
  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <span>(</span>
      <ExprContainerComp container={props.expr.expression} />
      <span>)</span>
    </div>
  )
}
