import { useExprValue } from '../../../../hooks/tree'
import type { ExprId } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'
import { ExprField } from '../../ui/expr-field'

export function ToStringExprComp({
  id,
  disabled,
}: {
  id: ExprId
  disabled: boolean
}) {
  const [opt] = useExprValue(id)
  if (opt == null || opt.name !== Expressions.ToString) return null

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).text,
      )}>
      <span>(</span>
      <ExprField
        exprId={opt.expr}
        parentId={id}
        field='expr'
        disabled={disabled}
      />
      <span>)</span>
    </div>
  )
}
