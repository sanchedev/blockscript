import type { AssignOpExpr, AssignOp } from '../../../../lib/blocks/expressions/classes/variables/assign-op'
import type { Expr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { ExprComp } from '../expr'
import { ExprBlock } from '../../ui/expr-block'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { useVariableIdentifiers } from '../../../../hooks/variables'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'

const operators: { value: AssignOp; label: string }[] = [
  { value: '+=' as AssignOp, label: '+=' },
  { value: '-=' as AssignOp, label: '-=' },
  { value: '*=' as AssignOp, label: '*=' },
  { value: '/=' as AssignOp, label: '/=' },
]

export function AssignOpExprComp(props: ExprCompProps<AssignOpExpr>) {
  const { updateAt } = useGlobalStmt()
  const styles = typeStyles[PrimaryType.number]
  const identifiers = useVariableIdentifiers()

  const handleIdentifierChange = (value: string) => {
    props.expr.edit(value, props.expr.operator, props.expr.expression)
    updateAt()
  }

  const handleOperatorChange = (value: string) => {
    const op = value as AssignOp
    props.expr.edit(props.expr.identifier, op, props.expr.expression)
    updateAt()
  }

  const handleExpressionEdit = (expr: Expr) => {
    props.expr.edit(props.expr.identifier, props.expr.operator, expr)
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
        <ExprComp
          expr={props.expr.expression}
          parent={props.expr}
          edit={handleExpressionEdit}
        />
      </div>
    </ExprBlock>
  )
}
