import type { StmtCompProps } from '../types'
import type { ElseStmt } from '../../../../lib/blocks/statements'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function ElseStmtComp(props: StmtCompProps<ElseStmt>) {
  return (
    <StmtWithBlock
      stmt={props.stmt}
      top={
        <>
          <span>sino entonces {'{'}</span>
        </>
      }
      block={props.stmt.body}
    />
  )
}
