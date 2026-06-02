import { use, useState } from 'react'
import type { BinaryExpr, BinaryOp } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import {
  IconAsterisk,
  IconCirclePercentage,
  IconMinus,
  IconPlus,
  IconSlash,
} from '@tabler/icons-react'
import { ExprCtx } from '../../../../contexts/expr'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'
import { ExprContainerComp } from '../../ui/expr-container'

const operators = ['+', '-', '*', '/', '%'] as const
const operatorIcons = [
  IconPlus,
  IconMinus,
  IconAsterisk,
  IconSlash,
  IconCirclePercentage,
]
const labels = ['Más', 'Menos', 'Por', 'Sobre', 'Módulo']

export function BinaryExprComp(props: ExprCompProps<BinaryExpr>) {
  const [operatorIndex, setOperatorIndex] = useState(0)
  const { triggerUpdate } = use(ExprCtx)

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length

    props.expr.changeOperator(operators[index] as BinaryOp)
    triggerUpdate?.()
    setOperatorIndex(index)
  }

  return (
    <ExprBlock {...props}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.number).ring}`}>
        <ExprContainerComp container={props.expr.left} />
        <Button
          className='border-red-300 bg-white not-disabled:hover:bg-slate-100 ring-red-600 text-red-800'
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
