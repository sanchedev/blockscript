import type { ToBooleanExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'

export function ToBooleanExprComp(props: ExprCompProps<ToBooleanExpr>) {
  return (
    <ExprBlock {...props}>
      <div className='flex gap-2 items-center px-2'>
        <span>booleano</span>
        <ExprComp
          expr={props.expr.expression}
          parent={props.expr}
          edit={(expr) => props.expr.edit(expr)}
        />
      </div>
    </ExprBlock>
  )
}
