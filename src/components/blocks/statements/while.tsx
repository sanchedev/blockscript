import type { StmtCompProps } from './types'
import type { WhileStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'

export function WhileStmtComp(props: StmtCompProps<WhileStmt>) {
  return (
    <div>
      <StmtBlock
        {...props}
        className='bg-amber-300 border-amber-500 text-amber-800 rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>mientras</span>
          <ExprComp
            expr={props.stmt.condition}
            parent={props.stmt}
            edit={(expr) => props.stmt.edit(expr, props.stmt.body)}
          />
          <span>hacer</span>
        </div>
      </StmtBlock>
      <BlockStmtComp stmt={props.stmt.body} removeRoundedTop />
    </div>
  )
}
