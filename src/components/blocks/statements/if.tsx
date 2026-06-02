import type { StmtCompProps } from './types'
import type { IfStmt } from '../../../lib/blocks/statements'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'
import { ExprContainerComp } from '../ui/expr-container'

export function IfStmtComp(props: StmtCompProps<IfStmt>) {
  return (
    <div>
      <StmtBlock {...props} className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>si</span>
          <ExprContainerComp container={props.stmt.condition} />
          <span>entonces</span>
        </div>
      </StmtBlock>
      <BlockStmtComp
        stmt={props.stmt.thenBody}
        parent={props.stmt}
        removeRoundedTop
      />
    </div>
  )
}
