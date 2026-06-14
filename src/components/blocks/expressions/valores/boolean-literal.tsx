import { useExprValue } from '../../../../hooks/tree'
import type { ExprId, BooleanExprOpt } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'

export function BooleanLiteralExprComp({ id, disabled }: { id: ExprId; disabled: boolean }) {
  const [expr, setExpr] = useExprValue(id)

  if (expr == null || expr.name !== Expressions.BooleanLiteral) return null
  const opt = expr as BooleanExprOpt

  const handleChange = () => {
    setExpr({ ...expr, literal: !opt.literal })
  }

  return (
    <button
      onClick={handleChange}
      className={clsx(
        'border-x-2 px-0.5 rounded-lg font-mono w-12 h-6 outline-none focus-visible:ring-2 text-center active:border-l-0 shadow',
        typeStyles(opt.type).text,
        typeStyles(opt.type).bg,
        typeStyles(opt.type).hover,
        typeStyles(opt.type).border,
        typeStyles(opt.type).ring,
      )}
      disabled={disabled}
      aria-label={opt.literal ? 'Verdadero' : 'Falso'}
    >
      {opt.literal ? 'V' : 'F'}
    </button>
  )
}
