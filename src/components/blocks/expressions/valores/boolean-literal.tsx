import type { BooleanLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'

export function BooleanLiteralExprComp(
  props: ExprCompProps<BooleanLiteralExpr>,
) {
  const { triggerUpdate } = use(ExprCtx)

  const handleChange = () => {
    props.expr.edit(!props.expr.literal)
    triggerUpdate?.()
  }

  return (
    <ExprBlock {...props}>
      <button
        onClick={handleChange}
        className={`rounded-lg border-2 border-slate-200 bg-white px-3 py-1 h-8 flex items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.boolean).ring}`}>
        {props.expr.literal ? 'verdadero' : 'falso'}
      </button>
    </ExprBlock>
  )
}
