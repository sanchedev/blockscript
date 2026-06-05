import type { BooleanLiteralExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'

export function BooleanLiteralExprComp(
  props: ExprCompProps<BooleanLiteralExpr>,
) {
  const { triggerUpdate } = use(ExprCtx)

  const handleChange = () => {
    props.expr.edit(!props.expr.literal)
    triggerUpdate?.()
  }

  return (
    <button
      onClick={handleChange}
      className={clsx(
        'border-x-2 px-0.5 rounded-lg font-mono w-12 h-6 outline-none focus-visible:ring-2 text-center active:border-l-0 shadow',
        typeStyles(props.expr.type).text,
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).hover,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).ring,
      )}
      aria-label={props.expr.literal ? 'Verdadero' : 'Falso'}>
      {props.expr.literal ? 'V' : 'F'}
    </button>
  )
}
