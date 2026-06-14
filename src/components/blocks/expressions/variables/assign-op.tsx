import { useExprValue } from '../../../../hooks/tree'
import type { ExprId } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import { AssignOp } from '../../../../lib/blocks/expressions/classes/variables/assign-op'
import { typeStyles } from '../../../../lib/type-styles'
import { VariableInput } from '../../ui/inputs/variable-input'
import { Button } from '../../../ui/button'
import { ExprField } from '../../ui/expr-field'
import clsx from 'clsx'

const operators = [
  AssignOp.AddAssign,
  AssignOp.SubAssign,
  AssignOp.MulAssign,
  AssignOp.DivAssign,
  AssignOp.ModAssign,
] as const

const labels = ['Más', 'Menos', 'Por', 'Sobre', 'Módulo']

export function AssignOpExprComp({
  id,
  disabled,
}: {
  id: ExprId
  disabled: boolean
}) {
  const [opt, setOpt] = useExprValue(id)
  if (opt == null || opt.name !== Expressions.AssignOp) return null

  const handleChange = (value: string) => {
    setOpt({ ...opt, identifier: value })
  }

  const handleOperatorChange = (value: string) => {
    const op = value as AssignOp
    setOpt({ ...opt, operator: op })
  }

  const operatorIndex = operators.indexOf(opt.operator as AssignOp)

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
        disabled={disabled}>
        {opt.operator}
      </Button>
      <ExprField
        exprId={opt.expr}
        parentId={id}
        field='expr'
        disabled={disabled}
      />
    </div>
  )
}
