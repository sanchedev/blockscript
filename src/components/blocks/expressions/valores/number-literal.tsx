import { useExprValue } from '../../../../hooks/tree'
import type { ExprId, NumberExprOpt } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { typeStyles } from '../../../../lib/type-styles'

export function NumberLiteralExprComp({ id, disabled }: { id: ExprId; disabled: boolean }) {
  const [expr, setExpr] = useExprValue(id)

  if (expr == null || expr.name !== Expressions.NumberLiteral) return null
  const opt = expr as NumberExprOpt

  const handleChange = (value: string) => {
    const num = value === '' ? 0 : Number(value)
    if (!isNaN(num)) {
      setExpr({ ...expr, literal: num })
    }
  }

  return (
    <label
      className={clsx(
        'flex border-x-2 px-1 rounded-lg font-mono w-fit h-6 has-focus-visible:ring-2 shadow',
        typeStyles(opt.type).text,
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).ring,
      )}>
      <Input
        type='number'
        autoFocus
        autoComplete='off'
        className={clsx('p-0 outline-0 w-full text-sm min-w-10')}
        value={String(opt.literal)}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: String(opt.literal).length + 2 + 'ch' }}
        disabled={disabled}
      />
    </label>
  )
}
