import { useExprValue } from '../../../../hooks/tree'
import type { ExprId, IncrementExprOpt } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import {
  IncrementOp,
} from '../../../../lib/blocks/expressions/classes/variables/increment'
import { typeStyles } from '../../../../lib/type-styles'
import { VariableInput } from '../../ui/inputs/variable-input'
import { Button } from '../../../ui/button'
import clsx from 'clsx'

const operators = [IncrementOp.Increment, IncrementOp.Decrement]
const labels = ['incrementar', 'decrementar']

export function IncrementExprComp({ id, disabled }: { id: ExprId; disabled: boolean }) {
  const [expr, setExpr] = useExprValue(id)

  if (expr == null || expr.name !== Expressions.Increment) return null
  const opt = expr as IncrementExprOpt

  const handleChange = (value: string) => {
    setExpr({ ...expr, identifier: value })
  }

  const handleOperatorChange = (value: string) => {
    const op = value as IncrementOp
    setExpr({ ...expr, operator: op })
  }

  const operatorIndex = operators.indexOf(opt.operator)

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow text-sm',
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).text,
      )}>
      <label
        className={clsx(
          'flex rounded-lg font-mono has-focus-visible:ring-2 h-6',
          typeStyles(opt.type).text,
          typeStyles(opt.type).bg,
          typeStyles(opt.type).ring,
        )}>
        <VariableInput
          identifier={opt.identifier}
          onIdentifierChange={handleChange}
          disabled={disabled}
        />
      </label>
      <Button
        className='border-red-300 bg-white not-disabled:hover:bg-slate-100 ring-red-600 text-red-800'
        variant='free'
        size='2xs'
        aria-label={labels[operatorIndex]}
        title={labels[operatorIndex]}
        onClick={() =>
          handleOperatorChange(
            operators[(operatorIndex + 1) % operators.length],
          )
        }
        disabled={disabled}
      >
        {opt.operator}
      </Button>
    </div>
  )
}
