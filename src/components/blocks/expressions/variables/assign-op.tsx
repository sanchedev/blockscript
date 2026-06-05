import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import {
  type AssignOpExpr,
  AssignOp,
} from '../../../../lib/blocks/expressions/classes/variables/assign-op'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'
import { VariableInput } from '../../ui/inputs/variable-input'
import { Button } from '../../../ui/button'
import clsx from 'clsx'

const operators = [
  AssignOp.AddAssign,
  AssignOp.SubAssign,
  AssignOp.MulAssign,
  AssignOp.DivAssign,
  AssignOp.ModAssign,
] as const

const labels = ['Más', 'Menos', 'Por', 'Sobre', 'Módulo']

export function AssignOpExprComp(props: ExprCompProps<AssignOpExpr>) {
  const { triggerUpdate } = use(ExprCtx)

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    triggerUpdate?.()
  }

  const handleOperatorChange = (value: string) => {
    const op = value as AssignOp
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
      <ExprContainerComp container={props.expr.expression} />
    </div>
  )
}
