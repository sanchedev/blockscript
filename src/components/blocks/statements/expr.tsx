import type { ExprStmt } from '../../../lib/blocks/statements'
import { ExprContainerComp } from '../ui/expr-container'
import { StmtBlock } from '../ui/stmt-block'
import type { StmtCompProps } from './types'

export function ExprStmtComp(props: StmtCompProps<ExprStmt>) {
  return (
    <StmtBlock {...props}>
      <ExprContainerComp container={props.stmt.expression} />
    </StmtBlock>
  )
}
