import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function ElseStmtComp({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const [opt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.Else) return null

  return (
    <StmtWithBlock
      name={opt.name}
      top={
        <>
          <span>sino entonces {'{'}</span>
        </>
      }
      bodyId={opt.body}
      disabled={disabled}
    />
  )
}
