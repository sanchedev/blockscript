import type { StringLiteralExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { typeStyles } from '../../../../lib/type-styles'
import { useRenderTree } from '../../../../hooks/render-tree'

export function StringLiteralExprComp(props: ExprCompProps<StringLiteralExpr>) {
  const renderTree = useRenderTree()

  const handleChange = (value: string) => {
    props.expr.edit(value)
    renderTree()
  }

  return (
    <label
      className={clsx(
        "flex border-x-2 px-0.5 rounded-lg font-mono before:content-['\"'] after:content-['\"'] w-fit h-6 has-focus-visible:ring-2 shadow",
        typeStyles(props.expr.type).text,
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).ring,
      )}>
      <Input
        autoFocus
        autoComplete='off'
        className={clsx('p-0 outline-0 w-full text-sm min-w-12')}
        value={props.expr.literal}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: props.expr.literal.length + 'ch' }}
        disabled={props.disabled}
      />
    </label>
  )
}
