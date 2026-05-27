import type { StmtCompProps } from './types'
import type { IfStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'

export function IfStmtComp(props: StmtCompProps<IfStmt>) {
  return (
    <div>
      <StmtBlock
        {...props}
        className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>si</span>
          <ExprComp
            expr={props.stmt.condition}
            parent={props.stmt}
            edit={(expr) => props.stmt.edit(expr, props.stmt.thenBody)}
          />
          <span>entonces</span>
        </div>
      </StmtBlock>
      <BlockStmtComp stmt={props.stmt.thenBody} removeRoundedTop />
    </div>
  )
}
