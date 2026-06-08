import type { LogicalExpr, LogicalOp } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'
import { ExprContainerComp } from '../../ui/expr-container'
import clsx from 'clsx'
import { useRenderTree } from '../../../../hooks/render-tree'

const operators = ['Y', 'O'] as const
const labels = ['Y (AND)', 'O (OR)']

export function LogicalExprComp(props: ExprCompProps<LogicalExpr>) {
  const renderTree = useRenderTree()

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length
    props.expr.changeOperator(operators[index] as LogicalOp)
    renderTree()
  }

  const operatorIndex = operators.indexOf(props.expr.operator)

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <ExprContainerComp
        container={props.expr.left}
        disabled={props.disabled}
      />
      <Button
        className='border-purple-300 bg-white not-disabled:hover:bg-slate-100 ring-purple-600 text-purple-800'
        variant='free'
        shape='square'
        size='2xs'
        aria-label={labels[operatorIndex]}
        title={labels[operatorIndex]}
        onClick={handleRotateOperator}
        disabled={props.disabled}>
        {props.expr.operator}
      </Button>
      <ExprContainerComp
        container={props.expr.right}
        disabled={props.disabled}
      />
    </div>
  )
}
