import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import {
  IncrementOp,
  type IncrementExpr,
} from '../../../../lib/blocks/expressions/classes/variables/increment'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import { VariableInput } from '../../ui/inputs/variable-input'
import { Button } from '../../../ui/button'
import clsx from 'clsx'

const operators = [IncrementOp.Increment, IncrementOp.Decrement]
const labels = ['incrementar', 'decrementar']

export function IncrementExprComp(props: ExprCompProps<IncrementExpr>) {
  const { triggerUpdate } = use(ExprCtx)

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    triggerUpdate?.()
  }

  const handleOperatorChange = (value: string) => {
    const op = value as IncrementOp
    props.expr.changeOperator(op)
    triggerUpdate?.()
  }

  const operatorIndex = operators.indexOf(props.expr.operator)
  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow text-sm',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <label
        className={clsx(
          'flex rounded-lg font-mono has-focus-visible:ring-2 h-6',
          typeStyles(props.expr.type).text,
          typeStyles(props.expr.type).bg,
          typeStyles(props.expr.type).ring,
        )}>
        <VariableInput
          identifier={props.expr.identifier}
          onIdentifierChange={handleChange}
        />
      </label>
      <Button
        className='border-red-300 bg-white not-disabled:hover:bg-slate-100 ring-red-600 text-red-800'
        variant='free'
        size='2xs'
        aria-label={labels[operatorIndex]}
        title={labels[operatorIndex]}
        onClick={() =>
          handleOperatorChange(
            operators[(operatorIndex + 1) % operators.length],
          )
        }>
        {props.expr.operator}
      </Button>
    </div>
  )
}
