import type { StmtCompProps } from '../types'
import type { WhileStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function WhileStmtComp(props: StmtCompProps<WhileStmt>) {
  return (
    <StmtWithBlock
      stmt={props.stmt}
      top={
        <>
          <span>mientras</span>
          <ExprContainerComp
            container={props.stmt.condition}
            disabled={props.disabled}
          />
          <span>hacer</span>
        </>
      }
      block={props.stmt.body}
      disabled={props.disabled}
    />
  )
}
