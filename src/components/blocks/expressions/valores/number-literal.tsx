import type { NumberLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import { ResizeInput } from '../../ui/resize-input'

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
    <ExprBlock {...props}>
      <ResizeInput
        exprType={props.expr.type}
        type='number'
        value={props.expr.literal.toString()}
        onChange={(ev) => handleChange(ev.target.value)}
      />
    </ExprBlock>
  )
}
