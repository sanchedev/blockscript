import { use, useState } from 'react'
import type { LogicalExpr, LogicalOp } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { ExprCtx } from '../../../../contexts/expr'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'
import { ExprContainerComp } from '../../ui/expr-container'

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
    <ExprBlock
      {...props}
      className={`${typeStyles(PrimaryType.boolean).bg} ${typeStyles(PrimaryType.boolean).text}`}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.boolean).ring}`}>
        <ExprContainerComp container={props.expr.left} />
        <Button
          className='border-indigo-300 bg-indigo-200 not-disabled:hover:bg-indigo-300 ring-indigo-600 text-indigo-800'
          variant='free'
          shape='square'
          aria-label={labels[operatorIndex]}
          title={labels[operatorIndex]}
          onClick={handleRotateOperator}>
          {operators[operatorIndex]}
        </Button>
        <ExprContainerComp container={props.expr.right} />
      </div>
    </ExprBlock>
  )
}
