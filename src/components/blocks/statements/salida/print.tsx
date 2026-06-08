import type { PrintStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import type { StmtCompProps } from '../types'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function PrintStmtComp(props: StmtCompProps<PrintStmt>) {
  return (
    <StmtBlock stmt={props.stmt}>
      <span>imprimir</span>
      <ExprContainerComp
        container={props.stmt.expression}
        disabled={props.disabled}
      />
    </StmtBlock>
  )
}
