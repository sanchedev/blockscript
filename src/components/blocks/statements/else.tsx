import type { StmtCompProps } from './types'
import type { ElseStmt } from '../../../lib/blocks/statements'
import { StmtBlock } from '../ui/stmt-block'
import { BlockStmtComp } from './block'

export function ElseStmtComp(props: StmtCompProps<ElseStmt>) {
  return (
    <div>
      <StmtBlock
        {...props}
        className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>sino entonces</span>
        </div>
      </StmtBlock>
      <BlockStmtComp stmt={props.stmt.body} removeRoundedTop />
    </div>
  )
}
