import type { ExprStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { StmtBlock } from '../ui/stmt-block'
import type { StmtCompProps } from './types'

export function ExprStmtComp(props: StmtCompProps<ExprStmt>) {
  return (
    <StmtBlock {...props} className='bg-sky-300 border-sky-500 text-sky-800'>
      <ExprComp
        expr={props.stmt.expression}
        parent={props.stmt}
        edit={(expr) => props.stmt.edit(expr)}
      />
    </StmtBlock>
  )
}
