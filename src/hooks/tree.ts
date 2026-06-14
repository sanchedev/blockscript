import { useTreeStore } from '../stores/tree-store'
import type { StmtId, StmtOptions } from '../lib/ui/stmts'
import type { ExprId, ExprOptions } from '../lib/ui/exprs'

export function useStmtValue(id: StmtId) {
  const stmt = useTreeStore((s) => s.stmts[id])
  const setStmt = useTreeStore((s) => s.setStmt)

  const setter = stmt != null
    ? (next: StmtOptions) => setStmt(id, next)
    : () => {}

  return [stmt, setter] as const
}

export function useExprValue(id: ExprId) {
  const expr = useTreeStore((s) => s.exprs[id])
  const setExpr = useTreeStore((s) => s.setExpr)

  const setter = expr != null
    ? (next: ExprOptions) => setExpr(id, next)
    : () => {}

  return [expr, setter] as const
}
