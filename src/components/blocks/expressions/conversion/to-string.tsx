import type { ToStringExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'

export function ToStringExprComp(props: ExprCompProps<ToStringExpr>) {
  return (
    <ExprBlock
      {...props}
      className={`${typeStyles(PrimaryType.string).bg} ${typeStyles(PrimaryType.string).text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span>texto</span>
        <ExprContainerComp container={props.expr.expression} />
      </div>
    </ExprBlock>
  )
}
