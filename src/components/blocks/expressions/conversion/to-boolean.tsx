import type { ToBooleanExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprContainerComp } from '../../ui/expr-container'
import type { ExprCompProps } from '../types'

export function ToBooleanExprComp(props: ExprCompProps<ToBooleanExpr>) {
  return (
    <ExprBlock {...props}>
      <div className='flex gap-2 items-center px-2'>
        <span>booleano</span>
        <ExprContainerComp container={props.expr.expression} />
      </div>
    </ExprBlock>
  )
}
