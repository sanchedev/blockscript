import { useExprValue } from '../../../../hooks/tree'
import type { ExprId, VariableExprOpt } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { useVariableType } from '../../../../hooks/variables'
import { PrimaryType } from '../../../../lib/types'
import { VariableInput } from '../../ui/inputs/variable-input'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'

export function VariableExprComp({ id, disabled }: { id: ExprId; disabled: boolean }) {
  const [expr, setExpr] = useExprValue(id)
  const getVariableType = useVariableType()

  if (expr == null || expr.name !== Expressions.Variable) return null
  const opt = expr as VariableExprOpt

  const handleChange = (value: string) => {
    setExpr({
      ...expr,
      identifier: value,
      type: getVariableType(value) ?? PrimaryType.null,
    })
  }

  return (
    <label
      className={clsx(
        'flex border-x-2 px-1 rounded-lg font-mono shadow has-focus-visible:ring-2 h-6',
        typeStyles(opt.type).text,
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).ring,
      )}>
      <VariableInput
        identifier={opt.identifier}
        onIdentifierChange={handleChange}
        disabled={disabled}
      />
    </label>
  )
}
