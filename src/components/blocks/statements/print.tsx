import type { PrintStmt } from '../../../lib/blocks/statements'
import { ExprContainerComp } from '../ui/expr-container'
import { StmtBlock } from '../ui/stmt-block'
import type { StmtCompProps } from './types'

export function PrintStmtComp(props: StmtCompProps<PrintStmt>) {
  return (
    <StmtBlock {...props}>
      <div className='pl-2 flex gap-4 items-center'>
        <span>imprimir</span>
        <ExprContainerComp container={props.stmt.expression} />
      </div>
    </StmtBlock>
  )
}
