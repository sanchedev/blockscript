import { useExprValue } from '../../../../hooks/tree'
import type { ExprId } from '../../../../lib/ui/exprs'
import { Expressions } from '../../../../lib/blocks/expressions/enum'
import type { BinaryOp } from '../../../../lib/blocks/expressions'
import { typeStyles } from '../../../../lib/type-styles'
import { Button } from '../../../ui/button'
import { ExprField } from '../../ui/expr-field'
import clsx from 'clsx'

const operators = ['+', '-', '*', '/', '%'] as const
const labels = ['Más', 'Menos', 'Por', 'Sobre', 'Módulo']

export function BinaryExprComp({
  id,
  disabled,
}: {
  id: ExprId
  disabled: boolean
}) {
  const [opt, setOpt] = useExprValue(id)
  if (opt == null || opt.name !== Expressions.Binary) return null

  const operatorIndex = operators.indexOf(
    opt.operator as unknown as '+' | '-' | '*' | '/' | '%',
  )

  const handleRotateOperator = () => {
    const newOp = operators[
      (operatorIndex + 1) % operators.length
    ] as unknown as BinaryOp
    setOpt({ ...opt, operator: newOp })
  }

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow',
        typeStyles(opt.type).bg,
        typeStyles(opt.type).border,
        typeStyles(opt.type).text,
      )}>
      <ExprField
        exprId={opt.left}
        parentId={id}
        field='left'
        disabled={disabled}
      />
      <Button
        className='border-red-300 bg-white not-disabled:hover:bg-slate-100 ring-red-600 text-red-800'
        variant='free'
        shape='square'
        size='2xs'
        aria-label={labels[operatorIndex]}
        title={labels[operatorIndex]}
        onClick={handleRotateOperator}
        disabled={disabled}>
        {opt.operator}
      </Button>
      <ExprField
        exprId={opt.right}
        parentId={id}
        field='right'
        disabled={disabled}
      />
    </div>
  )
}
