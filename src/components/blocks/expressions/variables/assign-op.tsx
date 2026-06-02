import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import {
  type AssignOpExpr,
  AssignOp,
} from '../../../../lib/blocks/expressions/classes/variables/assign-op'
import type { ExprCompProps } from '../types'
import { ExprBlock } from '../../ui/expr-block'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'
import { ExprContainerComp } from '../../ui/expr-container'
import { VariableInput } from '../../ui/inputs/variable-input'
import { Button } from '../../../ui/button'
import {
  IconAsterisk,
  IconCirclePercentage,
  IconMinus,
  IconPlus,
  IconSlash,
} from '@tabler/icons-react'

const operators = [
  AssignOp.AddAssign,
  AssignOp.SubAssign,
  AssignOp.MulAssign,
  AssignOp.DivAssign,
  AssignOp.ModAssign,
] as const
const operatorIcons = [
  IconPlus,
  IconMinus,
  IconAsterisk,
  IconSlash,
  IconCirclePercentage,
]

const labels = ['Más', 'Menos', 'Por', 'Sobre', 'Módulo']

export function AssignOpExprComp(props: ExprCompProps<AssignOpExpr>) {
  const { triggerUpdate } = use(ExprCtx)
  const styles = typeStyles(PrimaryType.number)

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
    <ExprBlock {...props} className={`${styles.bg} ${styles.text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span className={styles.text}>asignar</span>
        <VariableInput
          exprType={props.expr.type}
          identifier={props.expr.identifier}
          onIdentifierChange={handleChange}
        />
        <Button
          className='border-red-300 bg-white not-disabled:hover:bg-slate-100 ring-red-600 text-red-800'
          variant='free'
          shape='square'
          size='sm'
          aria-label={labels[operatorIndex]}
          title={labels[operatorIndex]}
          onClick={() =>
            handleOperatorChange(
              operators[(operatorIndex + 1) % operators.length],
            )
          }
          icon={operatorIcons[operatorIndex]}
        />
        <ExprContainerComp container={props.expr.expression} />
      </div>
    </ExprBlock>
  )
}
