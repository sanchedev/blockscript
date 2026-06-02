import { use } from 'react'
import { ExprCtx } from '../../../../contexts/expr'
import type { AssignExpr } from '../../../../lib/blocks/expressions'
import type { ExprCompProps } from '../types'
import { ExprBlock } from '../../ui/expr-block'
import { typeStyles } from '../../../../lib/type-styles'
import { ExprContainerComp } from '../../ui/expr-container'
import { VariableInput } from '../../ui/inputs/variable-input'

export function AssignExprComp(props: ExprCompProps<AssignExpr>) {
  const { triggerUpdate } = use(ExprCtx)
  const styles = typeStyles(props.expr.type)

  const handleChange = (value: string) => {
    props.expr.changeIdentifier(value)
    triggerUpdate?.()
  }

  return (
    <ExprBlock {...props} className={`${styles.bg} ${styles.text} font-mono`}>
      <div className='flex gap-2 items-center px-2'>
        <span className={styles.text}>asignar</span>
        <VariableInput
          exprType={props.expr.type}
          identifier={props.expr.identifier}
          onIdentifierChange={handleChange}
        />
        <span className={styles.text}>=</span>
        <ExprContainerComp container={props.expr.expression} />
      </div>
    </ExprBlock>
  )
}
