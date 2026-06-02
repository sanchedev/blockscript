import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import type { VariableExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { useVariableType } from '../../../../hooks/variables'
import { PrimaryType } from '../../../../lib/types'
import { VariableInput } from '../../ui/inputs/variable-input'

export function VariableExprComp(props: ExprCompProps<VariableExpr>) {
  const { triggerUpdate } = use(ExprCtx)
  const getVariableType = useVariableType()

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    props.expr.changeType(getVariableType(value) ?? PrimaryType.null)
    triggerUpdate?.()
  }

  return (
    <ExprBlock {...props}>
      <VariableInput
        exprType={props.expr.type}
        identifier={props.expr.identifier}
        onIdentifierChange={handleChange}
      />
    </ExprBlock>
  )
}
