import type { StmtCompProps } from './types'
import type { ForStmt } from '../../../lib/blocks/statements'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'
import { InputD } from '../ui/input-d'
import { ExprContainerComp } from '../ui/expr-container'
import { use } from 'react'
import { StmtCtx } from '../../../contexts/stmt'

export function ForStmtComp(props: StmtCompProps<ForStmt>) {
  const { triggerUpdate } = use(StmtCtx)

  const handleIdentifierChange = (value: string) => {
    props.stmt.changeIdentifier(value)
    triggerUpdate()
  }

  return (
    <div>
      <StmtBlock {...props} className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center flex-wrap'>
          <span>para</span>
          <InputD
            value={props.stmt.identifier}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            placeholder='i'
            list='for-variables'
            className='w-20'
          />
          <span>desde</span>
          <ExprContainerComp container={props.stmt.start} />
          <span>hasta</span>
          <ExprContainerComp container={props.stmt.end} />
          <span>paso</span>
          <ExprContainerComp container={props.stmt.step} />
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
