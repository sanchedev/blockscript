import type { NumberLiteralExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { typeStyles } from '../../../../lib/type-styles'

export function NumberLiteralExprComp(props: ExprCompProps<NumberLiteralExpr>) {
  const { triggerUpdate } = use(ExprCtx)

  const handleChange = (value: string) => {
    const num = value === '' ? 0 : Number(value)
    if (!isNaN(num)) {
      props.expr.edit(num)
      triggerUpdate?.()
    }
  }

  return (
    <label
      className={clsx(
        'flex border-x-2 px-1 rounded-lg font-mono w-fit h-6 has-focus-visible:ring-2 shadow',
        typeStyles(props.expr.type).text,
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).ring,
      )}>
      <Input
        type='number'
        autoFocus
        autoComplete='off'
        className={clsx('p-0 outline-0 w-full text-sm min-w-10')}
        value={props.expr.literal.toString()}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: props.expr.literal.toString().length + 2 + 'ch' }}
      />
    </label>
  )
}
