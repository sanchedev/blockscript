import type { ToNumberExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprContainerComp } from '../../ui/expr-container'
import type { ExprCompProps } from '../types'

export function ToNumberExprComp(props: ExprCompProps<ToNumberExpr>) {
  return (
    <ExprBlock {...props}>
      <div className='flex gap-2 items-center px-2'>
        <span>número</span>
        <ExprContainerComp container={props.expr.expression} />
      </div>
    </ExprBlock>
  )
}
