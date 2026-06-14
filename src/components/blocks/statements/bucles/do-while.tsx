import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { ExprField } from '../../ui/expr-field'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function DoWhileStmtComp({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const [opt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.DoWhile) return null

  return (
    <StmtWithBlock
      name={opt.name}
      top={
        <>
          <span>hacer</span>
        </>
      }
      bodyId={opt.body}
      bottom={
        <>
          <span>mientras</span>
          <ExprField exprId={opt.condition} parentId={id} field="condition" disabled={disabled} />
        </>
      }
      disabled={disabled}
    />
  )
}
