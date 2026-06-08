import type { StmtCompProps } from '../types'
import type { ContinueStmt } from '../../../../lib/blocks/statements'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function ContinueStmtComp(props: StmtCompProps<ContinueStmt>) {
  return (
    <StmtBlock stmt={props.stmt}>
      <span>continuar</span>
    </StmtBlock>
  )
}
