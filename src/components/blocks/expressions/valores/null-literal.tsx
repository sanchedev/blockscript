import clsx from 'clsx'
import type { NullLiteralExpr } from '../../../../lib/blocks/expressions'
import { Input } from '../../ui/input'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'

export function NullLiteralExprComp(props: ExprCompProps<NullLiteralExpr>) {
  return (
    <label
      className={clsx(
        'flex border-x-2 px-0.5 rounded-lg font-mono w-12 h-6 shadow',
        typeStyles(props.expr.type).text,
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
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
