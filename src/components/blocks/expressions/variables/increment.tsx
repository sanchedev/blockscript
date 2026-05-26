import type { IncrementExpr, IncrementOp } from '../../../../lib/blocks/expressions/classes/variables/increment'
import type { ExprCompProps } from '../types'
import { ExprBlock } from '../../ui/expr-block'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { useVariableIdentifiers } from '../../../../hooks/variables'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'

const operators: { value: IncrementOp; label: string }[] = [
  { value: '++' as IncrementOp, label: '++' },
  { value: '--' as IncrementOp, label: '--' },
]

export function IncrementExprComp(props: ExprCompProps<IncrementExpr>) {
  const { updateAt } = useGlobalStmt()
  const styles = typeStyles[PrimaryType.number]
  const identifiers = useVariableIdentifiers()

  const handleIdentifierChange = (value: string) => {
    props.expr.edit(value, props.expr.operator)
    updateAt()
  }

  const handleOperatorChange = (value: string) => {
    const op = value as IncrementOp
    props.expr.edit(props.expr.identifier, op)
    updateAt()
  }

  return (
    <ExprBlock {...props} className={`${styles.bg} ${styles.text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span className={styles.text}>asignar</span>
        <select
          value={props.expr.identifier}
          onChange={(e) => handleIdentifierChange(e.target.value)}
          className={`rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 font-mono has-focus:ring-2 ${styles.ring} outline-0`}>
          <option value='' disabled>
            seleccionar...
          </option>
          {identifiers.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={props.expr.operator}
          onChange={(e) => handleOperatorChange(e.target.value)}
          className={`rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 font-mono has-focus:ring-2 ${styles.ring} outline-0`}>
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>
    </ExprBlock>
  )
}
