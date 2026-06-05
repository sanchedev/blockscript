import type { WaitStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import type { StmtCompProps } from '../types'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function WaitStmtComp(props: StmtCompProps<WaitStmt>) {
  return (
    <StmtBlock stmt={props.stmt}>
      <span>esperar</span>
      <ExprContainerComp container={props.stmt.duration} />
      <span>ms</span>
    </StmtBlock>
  )
}
