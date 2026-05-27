import type { PrintStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { StmtBlock } from '../ui/stmt-block'
import type { StmtCompProps } from './types'

export function PrintStmtComp(props: StmtCompProps<PrintStmt>) {
  return (
    <StmtBlock
      {...props}>
      <div className='pl-2 flex gap-4 items-center'>
        <span>imprimir</span>
        <ExprComp
          expr={props.stmt.expression}
          parent={props.stmt}
          edit={(expr) => props.stmt.edit(expr)}
        />
      </div>
    </StmtBlock>
  )
}
