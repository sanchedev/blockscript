import type { VariableExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import {
  useVariableIdentifiers,
  useVariableType,
} from '../../../../hooks/variables'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'

export function VariableExprComp(props: ExprCompProps<VariableExpr>) {
  const { updateAt } = useGlobalStmt()
  const getVariableType = useVariableType()
  const resolvedType =
    getVariableType(props.expr.identifier) ?? PrimaryType.null
  const styles = typeStyles[resolvedType]

  const identifiers = useVariableIdentifiers()

  const handleChange = (value: string) => {
    props.expr.edit(value, getVariableType(value) ?? PrimaryType.null)
    updateAt()
  }

  return (
    <ExprBlock {...props}>
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
    </ExprBlock>
  )
}
