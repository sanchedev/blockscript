import type { StmtCompProps } from './types'
import type { ElseIfStmt } from '../../../lib/blocks/statements'
import { StmtBlock } from '../ui/stmt-block'
import { BlockStmtComp } from './block'
import { ExprComp } from '../expressions/expr'

export function ElseIfStmtComp(props: StmtCompProps<ElseIfStmt>) {
  return (
    <div>
      <StmtBlock
        {...props}
        className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>o si</span>
          <ExprComp
            expr={props.stmt.condition}
            parent={props.stmt}
            edit={(expr) => props.stmt.edit(expr, props.stmt.body)}
          />
          <span>entonces</span>
        </div>
      </StmtBlock>
      <BlockStmtComp stmt={props.stmt.body} removeRoundedTop />
    </div>
  )
}
