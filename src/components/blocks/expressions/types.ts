import type { Expr } from '../../../lib/blocks/expressions/classes'
import type { Stmt } from '../../../lib/blocks/statements'

export interface ExprCompProps<T extends Expr = Expr> {
  parent: Stmt | Expr
  expr: T
  edit(expr: Expr): void
}
