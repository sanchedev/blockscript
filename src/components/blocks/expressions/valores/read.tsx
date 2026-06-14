import { useExprValue } from '../../../../hooks/tree'
import type { ExprId } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprField } from '../../ui/expr-field'
import clsx from 'clsx'

export function ReadExprComp({
  id,
  disabled,
}: {
  id: ExprId
  disabled: boolean
}) {
  const [opt] = useExprValue(id)
  if (opt == null || opt.name !== Expressions.Read) return null

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg flex items-center gap-1 px-1 h-6 font-mono shadow text-sm',
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).text,
      )}>
      <span>leer</span>
      <ExprField
        exprId={opt.prompt}
        parentId={id}
        field='prompt'
        disabled={disabled}
      />
    </div>
  )
}
