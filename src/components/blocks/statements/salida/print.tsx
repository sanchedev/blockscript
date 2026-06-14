import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { ExprField } from '../../ui/expr-field'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function PrintStmtComp({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const [opt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.Print) return null

  return (
    <StmtBlock name={opt.name}>
      <span>imprimir</span>
      <ExprField exprId={opt.expr} parentId={id} field="expr" disabled={disabled} />
    </StmtBlock>
  )
}
