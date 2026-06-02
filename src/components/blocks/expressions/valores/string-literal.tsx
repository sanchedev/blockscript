import type { StringLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import { ResizeInput } from '../../ui/resize-input'

export function StringLiteralExprComp(props: ExprCompProps<StringLiteralExpr>) {
  const { triggerUpdate } = use(ExprCtx)

  const handleChange = (value: string) => {
    props.expr.edit(value)
    triggerUpdate?.()
  }

  return (
    <ExprBlock {...props}>
      <ResizeInput
        exprType={props.expr.type}
        value={props.expr.literal}
        onChange={(e) => handleChange(e.target.value)}
        containerClassName={`before:content-['"'] after:content-['"']`}
      />
    </ExprBlock>
  )
}
