import clsx from 'clsx'
import type { StmtCompProps } from './types'
import type { DoWhileStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'
import { statementsGroups, StatementsGroupKey } from '../../../lib/blocks/statements/records/groups'
import { blockColorMap } from '../../../lib/theme'

export function DoWhileStmtComp(props: StmtCompProps<DoWhileStmt>) {
  const s = blockColorMap[statementsGroups[StatementsGroupKey.Bucles].blockColor]
  return (
    <div>
      <div className={clsx('border-l-2 p-1 rounded-xl flex flex-row items-center gap-2 font-mono shadow shadow-current/25 pl-3 rounded-b-none w-full h-12', s.bg, s.text, s.border)}>
        <span>hacer</span>
      </div>
      <BlockStmtComp
        stmt={props.stmt.body}
        removeRoundedTop
        removeRoundedBottom
      />
      <StmtBlock
        {...props}
        className='rounded-t-none w-full border-t-0'>
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
