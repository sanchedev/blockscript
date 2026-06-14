import { useStmtValue } from '../../../../hooks/tree'
import type { StmtId } from '../../../../lib/ui/stmts'
import { Statements } from '../../../../lib/blocks/statements/enum'
import { StmtBlock } from '../../ui/statements/stmt-block'

export function BreakStmtComp({ id }: { id: StmtId; disabled: boolean }) {
  const [opt] = useStmtValue(id)
  if (opt == null || opt.name !== Statements.Break) return null

  return (
    <StmtBlock name={opt.name}>
      <span>romper</span>
    </StmtBlock>
  )
}
