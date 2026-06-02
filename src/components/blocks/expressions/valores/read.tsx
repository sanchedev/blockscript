import type { ReadExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'

export function ReadExprComp(props: ExprCompProps<ReadExpr>) {
  return (
    <ExprBlock
      {...props}
      className={`${typeStyles(PrimaryType.string).bg} ${typeStyles(PrimaryType.string).text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span>leer</span>
        <ExprContainerComp container={props.expr.prompt} />
      </div>
    </ExprBlock>
  )
}
