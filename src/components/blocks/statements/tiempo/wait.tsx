import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { ExprField } from '../../ui/expr-field'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function WaitStmtComp({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const [opt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.Wait) return null

  return (
    <StmtBlock name={opt.name}>
      <span>esperar</span>
      <ExprField exprId={opt.duration} parentId={id} field="duration" disabled={disabled} />
      <span>ms</span>
    </StmtBlock>
  )
}
