import type { ConcatExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'
import { IconPlus } from '@tabler/icons-react'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'

export function ConcatExprComp(props: ExprCompProps<ConcatExpr>) {
  return (
    <ExprBlock {...props}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.string).ring}`}>
        <ExprComp
          expr={props.expr.left}
          parent={props.expr}
          edit={(expr) => props.expr.edit(expr, props.expr.right)}
        />
        <span className='size-9 flex justify-center items-center text-lime-700'>
          <IconPlus className='size-5' />
        </span>
        <ExprComp
          expr={props.expr.right}
          parent={props.expr}
          edit={(expr) => props.expr.edit(props.expr.left, expr)}
        />
      </div>
    </ExprBlock>
  )
}
