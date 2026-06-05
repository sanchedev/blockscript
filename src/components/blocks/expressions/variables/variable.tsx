import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import type { VariableExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { useVariableType } from '../../../../hooks/variables'
import { PrimaryType } from '../../../../lib/types'
import { VariableInput } from '../../ui/inputs/variable-input'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'

export function VariableExprComp(props: ExprCompProps<VariableExpr>) {
  const { triggerUpdate } = use(ExprCtx)
  const getVariableType = useVariableType()

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    props.expr.changeType(getVariableType(value) ?? PrimaryType.null)
    triggerUpdate?.()
  }

  return (
    <label
      className={clsx(
        'flex border-x-2 px-1 rounded-lg font-mono shadow has-focus-visible:ring-2 h-6',
        typeStyles(props.expr.type).text,
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).ring,
      )}>
      <VariableInput
        identifier={props.expr.identifier}
        onIdentifierChange={handleChange}
      />
    </label>
  )
}
