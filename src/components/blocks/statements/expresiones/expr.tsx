import type { ExprStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import type { StmtCompProps } from '../types'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function ExprStmtComp(props: StmtCompProps<ExprStmt>) {
  return (
    <StmtBlock stmt={props.stmt}>
      <ExprContainerComp container={props.stmt.expression} />
      <span>;</span>
    </StmtBlock>
  )
}
