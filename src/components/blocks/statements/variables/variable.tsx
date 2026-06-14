import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { ExprField } from '../../ui/expr-field'
import { Input } from '../../ui/input'
import clsx from 'clsx'
import { getStmtGroupColor } from '../../../../lib/blocks/statements/records/groups'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function VariableStmtComp({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const [opt, setOpt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.Variable) return null

  const handleChange = (value: string) => {
    setOpt({ ...opt, identifier: value })
  }

  return (
    <StmtBlock name={opt.name}>
      <span>sea</span>
      <label
        className={clsx(
          'flex rounded-lg font-mono w-fit has-focus-visible:ring-2 h-6',
          getStmtGroupColor(opt.name).text,
          getStmtGroupColor(opt.name).bg,
          getStmtGroupColor(opt.name).ring,
        )}>
        <Input
          autoFocus
          autoComplete='off'
          className={clsx(
            'p-0 outline-0 text-center w-full text-sm',
            'bg-gray-50 border-x-2 border-slate-300 rounded-lg min-w-12',
          )}
          value={opt.identifier}
          onChange={(ev) => handleChange(ev.target.value)}
          style={{ width: opt.identifier.length + 2 + 'ch' }}
        />
      </label>
      <span>=</span>
      <ExprField exprId={opt.expr} parentId={id} field="expr" disabled={disabled} />
    </StmtBlock>
  )
}
