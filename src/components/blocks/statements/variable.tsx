import type { VariableStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import type { StmtCompProps } from './types'
import { useGlobalStmt } from '../../../hooks/global-stmt'
import { useVariableUpdateReferences } from '../../../hooks/variables'
import { StmtBlock } from '../ui/stmt-block'

export function VariableStmtComp(props: StmtCompProps<VariableStmt>) {
  const { updateAt } = useGlobalStmt()
  const updateReferences = useVariableUpdateReferences()

  const handleChange = (value: string) => {
    updateReferences(props.stmt.identifier, value, props.stmt.expression.type)
    props.stmt.edit(value, props.stmt.expression)
    updateAt()
  }

  return (
    <StmtBlock {...props}>
      <div className='pl-2 flex gap-4 items-center'>
        <span>crear</span>
        <div className='min-w-16 w-24 resize-x overflow-hidden'>
          <input
            type='text'
            value={props.stmt.identifier}
            onChange={(e) => handleChange(e.target.value)}
            placeholder='nombre'
            className='rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 font-mono has-focus:ring-2 ring-cyan-300 outline-0 w-full'
          />
        </div>
        <span>=</span>
        <ExprComp
          expr={props.stmt.expression}
          parent={props.stmt}
          edit={(expr) => {
            props.stmt.edit(props.stmt.identifier, expr)
            updateReferences(
              props.stmt.identifier,
              props.stmt.identifier,
              expr.type,
            )
          }}
        />
      </div>
    </StmtBlock>
  )
}
