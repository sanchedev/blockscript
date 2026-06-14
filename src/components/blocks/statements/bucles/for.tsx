import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { ExprField } from '../../ui/expr-field'
import clsx from 'clsx'
import { Input } from '../../ui/input'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function ForStmtComp({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const [opt, setOpt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.For) return null

  const handleIdentifierChange = (value: string) => {
    setOpt({ ...opt, identifier: value })
  }

  return (
    <StmtWithBlock
      name={opt.name}
      top={
        <>
          <span>para</span>
          <label
            className={clsx(
              'flex rounded-lg font-mono has-focus-visible:ring-2 h-6',
              typeStyles(PrimaryType.number).text,
              typeStyles(PrimaryType.number).bg,
              typeStyles(PrimaryType.number).ring,
            )}>
            <Input
              autoFocus
              autoComplete='off'
              className={clsx(
                'p-0 outline-0 text-center w-full text-sm',
                'bg-gray-50 border-x-2 border-slate-300 rounded-lg min-w-12',
              )}
              value={opt.identifier}
              onChange={(ev) => handleIdentifierChange(ev.target.value)}
              style={{ width: opt.identifier.length + 2 + 'ch' }}
            />
          </label>
          <span>desde</span>
          <ExprField exprId={opt.start} parentId={id} field="start" disabled={disabled} />
          <span>hasta</span>
          <ExprField exprId={opt.end} parentId={id} field="end" disabled={disabled} />
          <span>paso</span>
          <ExprField exprId={opt.step} parentId={id} field="step" disabled={disabled} />
        </>
      }
      bodyId={opt.body}
      disabled={disabled}
    />
  )
}
