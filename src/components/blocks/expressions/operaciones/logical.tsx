import { useState } from 'react'
import type { LogicalExpr, LogicalOp } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'

const operators = ['Y', 'O'] as const
const labels = ['Y (AND)', 'O (OR)']

export function LogicalExprComp(props: ExprCompProps<LogicalExpr>) {
  const [operatorIndex, setOperatorIndex] = useState(0)
  const { updateAt } = useGlobalStmt()

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length
    props.expr.edit(
      props.expr.left,
      operators[index] as LogicalOp,
      props.expr.right,
    )
    updateAt()
    setOperatorIndex(index)
  }

  return (
    <ExprBlock
      {...props}
      className={`${typeStyles[PrimaryType.boolean].bg} ${typeStyles[PrimaryType.boolean].text}`}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles[PrimaryType.boolean].ring}`}>
        <ExprComp
          expr={props.expr.left}
          parent={props.expr}
          edit={(expr) =>
            props.expr.edit(expr, props.expr.operator, props.expr.right)
          }
        />
        <Button
          className='border-indigo-300 bg-indigo-200 not-disabled:hover:bg-indigo-300 ring-indigo-600 text-indigo-800'
          variant='free'
          shape='square'
          aria-label={labels[operatorIndex]}
          title={labels[operatorIndex]}
          onClick={handleRotateOperator}>
          {operators[operatorIndex]}
        </Button>
        <ExprComp
          expr={props.expr.right}
          parent={props.expr}
          edit={(expr) =>
            props.expr.edit(props.expr.left, props.expr.operator, expr)
          }
        />
      </div>
    </ExprBlock>
  )
}
