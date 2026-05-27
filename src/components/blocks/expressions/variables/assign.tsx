import type { AssignExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { ExprComp } from '../expr'
import { ExprBlock } from '../../ui/expr-block'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { useVariableIdentifiers } from '../../../../hooks/variables'
import { typeStyles } from '../../../../lib/type-styles'

export function AssignExprComp(props: ExprCompProps<AssignExpr>) {
  const { updateAt } = useGlobalStmt()
  const styles = typeStyles(props.expr.type)

  const identifiers = useVariableIdentifiers()

  const handleChange = (value: string) => {
    props.expr.edit(value, props.expr.expression)
    updateAt()
  }

  return (
    <ExprBlock {...props} className={`${styles.bg} ${styles.text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span className={styles.text}>asignar</span>
        <select
          value={props.expr.identifier}
          onChange={(e) => handleChange(e.target.value)}
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
          <span className={styles.text}>=</span>
        <ExprComp
          expr={props.expr.expression}
          parent={props.expr}
          edit={(expr) => props.expr.edit(props.expr.identifier, expr)}
        />
      </div>
    </ExprBlock>
  )
}
