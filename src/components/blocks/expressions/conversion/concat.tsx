import type { ConcatExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { IconPlus } from '@tabler/icons-react'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'
import { ExprContainerComp } from '../../ui/expr-container'

export function ConcatExprComp(props: ExprCompProps<ConcatExpr>) {
  return (
    <ExprBlock {...props}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.string).ring}`}>
        <ExprContainerComp container={props.expr.left} />
        <span className='size-9 flex justify-center items-center text-lime-700'>
          <IconPlus className='size-5' />
        </span>
        <ExprContainerComp container={props.expr.right} />
      </div>
    </ExprBlock>
  )
}
