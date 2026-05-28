import type { WaitStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { StmtBlock } from '../ui/stmt-block'
import type { StmtCompProps } from './types'

export function WaitStmtComp(props: StmtCompProps<WaitStmt>) {
  return (
    <StmtBlock {...props}>
      <div className='pl-2 flex gap-4 items-center'>
        <span>esperar</span>
        <ExprComp
          expr={props.stmt.duration}
          parent={props.stmt}
          edit={(expr) => props.stmt.edit(expr)}
        />
        <span>ms</span>
      </div>
    </StmtBlock>
  )
}
