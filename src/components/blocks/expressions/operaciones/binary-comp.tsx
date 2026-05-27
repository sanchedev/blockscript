import { useState } from 'react'
import type {
  BinaryCompExpr,
  BinaryCompOp,
} from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'
import {
  IconEqual,
  IconEqualNot,
  IconMathEqualGreater,
  IconMathEqualLower,
  IconMathGreater,
  IconMathLower,
} from '@tabler/icons-react'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'

const operators = ['>', '<', '>=', '<=', '==', '!='] as const
const labels = [
  'Mayor que',
  'Menor que',
  'Mayor o igual',
  'Menor o igual',
  'Igual',
  'Distinto',
]

export function BinaryCompExprComp(props: ExprCompProps<BinaryCompExpr>) {
  const [operatorIndex, setOperatorIndex] = useState(0)

  const { updateAt } = useGlobalStmt()

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length
    props.expr.edit(
      props.expr.left,
      operators[index] as BinaryCompOp,
      props.expr.right,
    )
    updateAt()
    setOperatorIndex(index)
  }

  return (
    <ExprBlock
      {...props}
      className={`${typeStyles(PrimaryType.boolean).bg} ${typeStyles(PrimaryType.boolean).text}`}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.boolean).ring}`}>
        <ExprComp
          expr={props.expr.left}
          parent={props.expr}
          edit={(expr) =>
            props.expr.edit(expr, props.expr.operator, props.expr.right)
          }
        />
        <Button
          className='border-purple-300 bg-purple-200 not-disabled:hover:bg-purple-300 ring-purple-600 text-purple-800'
          variant='free'
          shape='square'
          aria-label={labels[operatorIndex]}
          title={labels[operatorIndex]}
          onClick={handleRotateOperator}>
          {operators[operatorIndex] == '>' && (
            <IconMathGreater className='size-5' />
          )}
          {operators[operatorIndex] == '<' && (
            <IconMathLower className='size-5' />
          )}
          {operators[operatorIndex] == '>=' && (
            <IconMathEqualGreater className='size-5' />
          )}
          {operators[operatorIndex] == '<=' && (
            <IconMathEqualLower className='size-5' />
          )}
          {operators[operatorIndex] == '==' && <IconEqual className='size-5' />}
          {operators[operatorIndex] == '!=' && (
            <IconEqualNot className='size-5' />
          )}
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
