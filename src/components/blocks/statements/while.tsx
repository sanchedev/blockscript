import type { StmtCompProps } from './types'
import type { WhileStmt } from '../../../lib/blocks/statements'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'
import { ExprContainerComp } from '../ui/expr-container'

export function WhileStmtComp(props: StmtCompProps<WhileStmt>) {
  return (
    <div>
      <StmtBlock {...props} className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>mientras</span>
          <ExprContainerComp container={props.stmt.condition} />
          <span>hacer</span>
        </div>
      </StmtBlock>
      <BlockStmtComp
        stmt={props.stmt.body}
        parent={props.stmt}
        removeRoundedTop
      />
    </div>
  )
}
