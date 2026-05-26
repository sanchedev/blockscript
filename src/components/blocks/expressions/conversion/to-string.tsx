import type { ToStringExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'

export function ToStringExprComp(props: ExprCompProps<ToStringExpr>) {
  return (
    <ExprBlock
      {...props}
      className={`${typeStyles[PrimaryType.string].bg} ${typeStyles[PrimaryType.string].text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span>texto</span>
        <ExprComp
          expr={props.expr.expression}
          parent={props.expr}
          edit={(expr) => props.expr.edit(expr)}
        />
      </div>
    </ExprBlock>
  )
}
