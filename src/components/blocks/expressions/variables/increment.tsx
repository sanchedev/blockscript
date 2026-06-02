import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import {
  IncrementOp,
  type IncrementExpr,
} from '../../../../lib/blocks/expressions/classes/variables/increment'
import type { ExprCompProps } from '../types'
import { ExprBlock } from '../../ui/expr-block'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'
import { VariableInput } from '../../ui/inputs/variable-input'
import { Button } from '../../../ui/button'
import { IconExposureMinus1, IconExposurePlus1 } from '@tabler/icons-react'

const operators = [IncrementOp.Increment, IncrementOp.Decrement]
const operatorIcons = [IconExposurePlus1, IconExposureMinus1]
const labels = ['incrementar', 'decrementar']

export function IncrementExprComp(props: ExprCompProps<IncrementExpr>) {
  const { triggerUpdate } = use(ExprCtx)
  const styles = typeStyles(PrimaryType.number)

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    triggerUpdate?.()
  }

  const handleOperatorChange = (value: string) => {
    const op = value as IncrementOp
    props.expr.changeOperator(op)
    triggerUpdate?.()
  }

  const operatorIndex = operators.indexOf(props.expr.operator)
  return (
    <ExprBlock {...props} className={`${styles.bg} ${styles.text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span className={styles.text}>{labels[operatorIndex]}</span>
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
      </div>
    </ExprBlock>
  )
}
