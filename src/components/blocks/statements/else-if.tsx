import type { StmtCompProps } from './types'
import type { ElseIfStmt } from '../../../lib/blocks/statements'
import { StmtBlock } from '../ui/stmt-block'
import { BlockStmtComp } from './block'
import { ExprContainerComp } from '../ui/expr-container'

export function ElseIfStmtComp(props: StmtCompProps<ElseIfStmt>) {
  return (
    <div>
      <StmtBlock {...props} className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>o si</span>
          <ExprContainerComp container={props.stmt.condition} />
          <span>entonces</span>
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
