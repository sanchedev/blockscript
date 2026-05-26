import type { ReadExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { ExprComp } from '../expr'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'

export function ReadExprComp(props: ExprCompProps<ReadExpr>) {
  return (
    <ExprBlock {...props} className={`${typeStyles[PrimaryType.string].bg} ${typeStyles[PrimaryType.string].text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span>leer</span>
        <ExprComp
          parent={props.expr}
          expr={props.expr.prompt}
          edit={(expr) => props.expr.edit(expr)}
        />
      </div>
    </ExprBlock>
  )
}
