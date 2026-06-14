import type { StmtId } from '../../../lib/ui/stmts'
import { useTreeStore } from '../../../stores/tree-store'
import { Statements } from '../../../lib/blocks/statements/enum'
import { ExprStmtComp } from '../statements/expresiones/expr'
import { PrintStmtComp } from '../statements/salida/print'
import { VariableStmtComp } from '../statements/variables/variable'
import { IfStmtComp } from '../statements/condicionales/if'
import { ElseIfStmtComp } from '../statements/condicionales/else-if'
import { ElseStmtComp } from '../statements/condicionales/else'
import { WhileStmtComp } from '../statements/bucles/while'
import { DoWhileStmtComp } from '../statements/bucles/do-while'
import { ForStmtComp } from '../statements/bucles/for'
import { WaitStmtComp } from '../statements/tiempo/wait'
import { BreakStmtComp } from '../statements/bucles/break'
import { ContinueStmtComp } from '../statements/bucles/continue'

export function StmtRenderer({ id, disabled }: { id: StmtId; disabled: boolean }) {
  const opt = useTreeStore((s) => s.stmts[id])
  if (opt == null) return null

  switch (opt.name) {
    case Statements.Expr:
      return <ExprStmtComp id={id} disabled={disabled} />
    case Statements.Print:
      return <PrintStmtComp id={id} disabled={disabled} />
    case Statements.Variable:
      return <VariableStmtComp id={id} disabled={disabled} />
    case Statements.If:
      return <IfStmtComp id={id} disabled={disabled} />
    case Statements.ElseIf:
      return <ElseIfStmtComp id={id} disabled={disabled} />
    case Statements.Else:
      return <ElseStmtComp id={id} disabled={disabled} />
    case Statements.While:
      return <WhileStmtComp id={id} disabled={disabled} />
    case Statements.DoWhile:
      return <DoWhileStmtComp id={id} disabled={disabled} />
    case Statements.For:
      return <ForStmtComp id={id} disabled={disabled} />
    case Statements.Wait:
      return <WaitStmtComp id={id} disabled={disabled} />
    case Statements.Break:
      return <BreakStmtComp id={id} disabled={disabled} />
    case Statements.Continue:
      return <ContinueStmtComp id={id} disabled={disabled} />
    default:
      return null
  }
}
