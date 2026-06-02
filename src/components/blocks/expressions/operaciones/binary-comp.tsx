import { use, useState } from 'react'
import type {
  BinaryCompExpr,
  BinaryCompOp,
} from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import {
  IconEqual,
  IconEqualNot,
  IconMathEqualGreater,
  IconMathEqualLower,
  IconMathGreater,
  IconMathLower,
} from '@tabler/icons-react'
import { ExprCtx } from '../../../../contexts/expr'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'
import { ExprContainerComp } from '../../ui/expr-container'

const operators = ['>', '<', '>=', '<=', '==', '!='] as const
const operatorIcons = [
  IconMathGreater,
  IconMathLower,
  IconMathEqualGreater,
  IconMathEqualLower,
  IconEqual,
  IconEqualNot,
]
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
  const { triggerUpdate } = use(ExprCtx)

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length
    props.expr.changeOperator(operators[index] as BinaryCompOp)
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
          className='border-purple-300 bg-white not-disabled:hover:bg-slate-100 ring-purple-600 text-purple-800'
          variant='free'
          shape='square'
          size='sm'
          aria-label={labels[operatorIndex]}
          title={labels[operatorIndex]}
          onClick={handleRotateOperator}
          icon={operatorIcons[operatorIndex]}
        />
        <ExprContainerComp container={props.expr.right} />
      </div>
    </ExprBlock>
  )
}
