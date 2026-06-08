import type { StmtCompProps } from '../types'
import type { IfStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function IfStmtComp(props: StmtCompProps<IfStmt>) {
  return (
    <StmtWithBlock
      stmt={props.stmt}
      top={
        <>
          <span>si</span>
          <ExprContainerComp
            container={props.stmt.condition}
            disabled={props.disabled}
          />
          <span>entonces</span>
        </>
      }
      block={props.stmt.thenBody}
      disabled={props.disabled}
    />
  )
}
