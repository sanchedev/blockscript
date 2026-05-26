import type { StmtCompProps } from './types'
import type { DoWhileStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'

export function DoWhileStmtComp(props: StmtCompProps<DoWhileStmt>) {
  return (
    <div>
      <div className='border-l-2 p-1 rounded-xl flex flex-row items-center gap-2 font-mono shadow shadow-current/25 pl-3 bg-amber-300 border-amber-500 text-amber-800 rounded-b-none w-full h-12'>
        <span>hacer</span>
      </div>
      <BlockStmtComp
        stmt={props.stmt.body}
        removeRoundedTop
        removeRoundedBottom
      />
      <StmtBlock
        {...props}
        className='bg-amber-300 border-amber-500 text-amber-800 rounded-t-none w-full border-t-0'>
        <div className='pl-2 flex gap-4 items-center'>
          <span>mientras</span>
          <ExprComp
            expr={props.stmt.condition}
            parent={props.stmt}
            edit={(expr) => props.stmt.edit(props.stmt.body, expr)}
          />
        </div>
      </StmtBlock>
    </div>
  )
}
