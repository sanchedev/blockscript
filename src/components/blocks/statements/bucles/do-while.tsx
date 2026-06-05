import type { StmtCompProps } from '../types'
import type { DoWhileStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function DoWhileStmtComp(props: StmtCompProps<DoWhileStmt>) {
  return (
    <StmtWithBlock
      stmt={props.stmt}
      top={
        <>
          <span>hacer</span>
        </>
      }
      block={props.stmt.body}
      bottom={
        <>
          <span>mientras</span>
          <ExprContainerComp container={props.stmt.condition} />
        </>
      }
    />
  )
}
