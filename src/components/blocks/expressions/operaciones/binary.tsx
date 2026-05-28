import { useState } from 'react'
import type { BinaryExpr, BinaryOp } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { ExprComp } from '../expr'
import type { ExprCompProps } from '../types'
import {
  IconAsterisk,
  IconCirclePercentage,
  IconMinus,
  IconPlus,
  IconSlash,
} from '@tabler/icons-react'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'

const operators = ['+', '-', '*', '/', '%'] as const
const operatorIcons = [IconPlus, IconMinus, IconAsterisk, IconSlash, IconCirclePercentage]
const labels = ['Más', 'Menos', 'Por', 'Sobre', 'Módulo']

export function BinaryExprComp(props: ExprCompProps<BinaryExpr>) {
  const [operatorIndex, setOperatorIndex] = useState(0)

  const { updateAt } = useGlobalStmt()

  const handleRotateOperator = () => {
    const index = (operatorIndex + 1) % operators.length

    props.expr.edit(
      props.expr.left,
      operators[index] as BinaryOp,
      props.expr.right,
    )
    updateAt()
    setOperatorIndex(index)
  }

  return (
    <ExprBlock {...props}>
      <div
        className={`rounded-xl border-2 border-slate-200 bg-white p-1 flex gap-2 w-fit resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.number).ring}`}>
        <ExprComp
          expr={props.expr.left}
          parent={props.expr}
          edit={(expr) =>
            props.expr.edit(expr, props.expr.operator, props.expr.right)
          }
        />
        <Button
          className='border-red-300 bg-red-200 not-disabled:hover:bg-red-300 ring-red-600 text-red-800'
          variant='free'
          shape='square'
          aria-label={labels[operatorIndex]}
          title={labels[operatorIndex]}
          onClick={handleRotateOperator}
          icon={operatorIcons[operatorIndex]}
        />
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
