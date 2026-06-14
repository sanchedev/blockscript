import { useExprValue } from '../../../../hooks/tree'
import type { ExprId, NullExprOpt } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { typeStyles } from '../../../../lib/type-styles'

export function NullLiteralExprComp({ id }: { id: ExprId; disabled: boolean }) {
  const [expr] = useExprValue(id)

  if (expr == null || expr.name !== Expressions.NullLiteral) return null
  const opt = expr as NullExprOpt

  return (
    <label
      className={clsx(
        'flex border-x-2 px-0.5 rounded-lg font-mono w-12 h-6 shadow',
        typeStyles(opt.type).text,
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
      )}>
      <Input
        autoFocus={false}
        autoComplete='off'
        value='nulo'
        disabled
        readOnly
        className={clsx('p-0 outline-0 text-center w-full text-sm')}
      />
    </label>
  )
}
