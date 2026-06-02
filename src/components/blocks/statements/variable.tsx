import type { VariableStmt } from '../../../lib/blocks/statements'
import type { StmtCompProps } from './types'
import { StmtBlock } from '../ui/stmt-block'
import { ExprContainerComp } from '../ui/expr-container'
import { use } from 'react'
import { StmtCtx } from '../../../contexts/stmt'
import { ResizeInput } from '../ui/resize-input'
import { PrimaryType } from '../../../lib/types'

export function VariableStmtComp(props: StmtCompProps<VariableStmt>) {
  const { triggerUpdate } = use(StmtCtx)

  const handleChange = (value: string) => {
    props.stmt.changeIdentifier(value)
    triggerUpdate()
  }

  return (
    <StmtBlock {...props}>
      <div className='pl-2 flex gap-4 items-center'>
        <span>crear</span>
        <ResizeInput
          exprType={PrimaryType.string}
          value={props.stmt.identifier}
          onChange={(ev) => handleChange(ev.target.value)}
          placeholder='nombre'
        />
        <span>=</span>
        <ExprContainerComp container={props.stmt.expression} />
      </div>
    </StmtBlock>
  )
}
