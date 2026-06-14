import { useExprValue } from '../../../../hooks/tree'
import type { ExprId, StringExprOpt } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { typeStyles } from '../../../../lib/type-styles'

export function StringLiteralExprComp({ id, disabled }: { id: ExprId; disabled: boolean }) {
  const [expr, setExpr] = useExprValue(id)

  if (expr == null || expr.name !== Expressions.StringLiteral) return null
  const opt = expr as StringExprOpt

  const handleChange = (value: string) => {
    setExpr({ ...expr, literal: value })
  }

  return (
    <label
      className={clsx(
        "flex border-x-2 px-0.5 rounded-lg font-mono before:content-['\"'] after:content-['\"'] w-fit h-6 has-focus-visible:ring-2 shadow",
        typeStyles(opt.type).text,
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).ring,
      )}>
      <Input
        autoFocus
        autoComplete='off'
        className={clsx('p-0 outline-0 w-full text-sm min-w-12')}
        value={opt.literal}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: opt.literal.length + 'ch' }}
        disabled={disabled}
      />
    </label>
  )
}
