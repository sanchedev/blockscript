import type { VariableStmt } from '../../../../lib/blocks/statements'
import type { StmtCompProps } from '../types'
import { ExprContainerComp } from '../../ui/expr-container'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { getStmtGroupColor } from '../../../../lib/blocks/statements/records/groups'
import { StmtBlock } from '../../ui/statements/stmt-block'
import { useRenderTree } from '../../../../hooks/render-tree'

export function VariableStmtComp(props: StmtCompProps<VariableStmt>) {
  const renderTree = useRenderTree()

  const handleChange = (value: string) => {
    props.stmt.changeIdentifier(value)
    renderTree()
  }

  return (
    <StmtBlock stmt={props.stmt}>
      <span>sea</span>
      <label
        className={clsx(
          'flex rounded-lg font-mono w-fit has-focus-visible:ring-2 h-6',
          getStmtGroupColor(props.stmt.name).text,
          getStmtGroupColor(props.stmt.name).bg,
          getStmtGroupColor(props.stmt.name).ring,
        )}>
        <Input
          autoFocus
          autoComplete='off'
          className={clsx(
            'p-0 outline-0 text-center w-full text-sm',
            'bg-gray-50 border-x-2 border-slate-300 rounded-lg min-w-12',
          )}
          value={props.stmt.identifier}
          onChange={(ev) => handleChange(ev.target.value)}
          style={{ width: props.stmt.identifier.length + 2 + 'ch' }}
        />
      </label>
      <span>=</span>
      <ExprContainerComp
        container={props.stmt.expression}
        disabled={props.disabled}
      />
    </StmtBlock>
  )
}
