import { useExprValue } from '../../../../hooks/tree'
import type { ExprId } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { typeStyles } from '../../../../lib/type-styles'
import { VariableInput } from '../../ui/inputs/variable-input'
import { ExprField } from '../../ui/expr-field'
import clsx from 'clsx'

export function AssignExprComp({
  id,
  disabled,
}: {
  id: ExprId
  disabled: boolean
}) {
  const [opt, setOpt] = useExprValue(id)
  if (opt == null || opt.name !== Expressions.Assign) return null

  const handleChange = (value: string) => {
    setOpt({ ...opt, identifier: value })
  }

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow text-sm',
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).text,
      )}>
      <label
        className={clsx(
          'flex rounded-lg font-mono has-focus-visible:ring-2 h-6',
          typeStyles(opt.type).text,
          typeStyles(opt.type).bg,
          typeStyles(opt.type).ring,
        )}>
        <VariableInput
          identifier={opt.identifier}
          onIdentifierChange={handleChange}
          disabled={disabled}
        />
      </label>
      <span className={typeStyles(opt.type).text}>=</span>
      <ExprField
        exprId={opt.expr}
        parentId={id}
        field='expr'
        disabled={disabled}
      />
    </div>
  )
}
