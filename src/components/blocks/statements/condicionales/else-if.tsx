import type { StmtCompProps } from '../types'
import type { ElseIfStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function ElseIfStmtComp(props: StmtCompProps<ElseIfStmt>) {
  return (
    <StmtWithBlock
      stmt={props.stmt}
      top={
        <>
          <span>o si</span>
          <ExprContainerComp container={props.stmt.condition} />
          <span>entonces</span>
        </>
      }
      block={props.stmt.body}
    />
  )
}
