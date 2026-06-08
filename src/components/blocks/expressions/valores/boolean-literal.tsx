import type { BooleanLiteralExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'
import { useRenderTree } from '../../../../hooks/render-tree'

export function BooleanLiteralExprComp(
  props: ExprCompProps<BooleanLiteralExpr>,
) {
  const renderTree = useRenderTree()

  const handleChange = () => {
    props.expr.edit(!props.expr.literal)
    renderTree()
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
      disabled={props.disabled}
      aria-label={props.expr.literal ? 'Verdadero' : 'Falso'}>
      {props.expr.literal ? 'V' : 'F'}
    </button>
  )
}
