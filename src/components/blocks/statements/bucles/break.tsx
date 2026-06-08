import type { StmtCompProps } from '../types'
import type { BreakStmt } from '../../../../lib/blocks/statements'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function BreakStmtComp(props: StmtCompProps<BreakStmt>) {
  return (
    <StmtBlock stmt={props.stmt}>
      <span>romper</span>
    </StmtBlock>
  )
}
