import type { AssignExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'
import { VariableInput } from '../../ui/inputs/variable-input'
import clsx from 'clsx'
import { useRenderTree } from '../../../../hooks/render-tree'

export function AssignExprComp(props: ExprCompProps<AssignExpr>) {
  const renderTree = useRenderTree()
  const styles = typeStyles(props.expr.type)

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    renderTree()
  }

  return (
    <div
      className={clsx(
        'border-x-2 rounded-lg font-mono flex items-center gap-1 px-1 h-6 shadow text-sm',
        typeStyles(props.expr.type).bg,
        typeStyles(props.expr.type).border,
        typeStyles(props.expr.type).text,
      )}>
      <label
        className={clsx(
          'flex rounded-lg font-mono has-focus-visible:ring-2 h-6',
          typeStyles(props.expr.type).text,
          typeStyles(props.expr.type).bg,
          typeStyles(props.expr.type).ring,
        )}>
        <VariableInput
          identifier={props.expr.identifier}
          onIdentifierChange={handleChange}
          disabled={props.disabled}
        />
      </label>
      <span className={styles.text}>=</span>
      <ExprContainerComp
        container={props.expr.expression}
        disabled={props.disabled}
      />
    </div>
  )
}
