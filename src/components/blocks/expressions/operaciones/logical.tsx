import { use, useState } from 'react'
import type { LogicalExpr, LogicalOp } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { ExprCtx } from '../../../../contexts/expr'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'
import { ExprContainerComp } from '../../ui/expr-container'
import clsx from 'clsx'

const operators = ['Y', 'O'] as const
const labels = ['Y (AND)', 'O (OR)']

export function LogicalExprComp(props: ExprCompProps<LogicalExpr>) {
  const [operatorIndex, setOperatorIndex] = useState(0)
  const { triggerUpdate } = use(ExprCtx)

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length
    props.expr.changeOperator(operators[index] as LogicalOp)
    triggerUpdate?.()
    setOperatorIndex(index)
  }

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <ExprContainerComp container={props.expr.left} />
      <Button
        className='border-purple-300 bg-white not-disabled:hover:bg-slate-100 ring-purple-600 text-purple-800'
        variant='free'
        shape='square'
        size='2xs'
        aria-label={labels[operatorIndex]}
        title={labels[operatorIndex]}
        onClick={handleRotateOperator}>
        {props.expr.operator}
      </Button>
      <ExprContainerComp container={props.expr.right} />
    </div>
  )
}
