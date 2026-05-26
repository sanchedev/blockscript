import type { ToNumberExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'

export function ToNumberExprComp(props: ExprCompProps<ToNumberExpr>) {
  return (
    <ExprBlock {...props}>
      <div className='flex gap-2 items-center px-2'>
        <span>número</span>
        <ExprComp
          expr={props.expr.expression}
          parent={props.expr}
          edit={(expr) => props.expr.edit(expr)}
        />
      </div>
    </ExprBlock>
  )
}
