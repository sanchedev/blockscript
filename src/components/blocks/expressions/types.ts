import type { Expr } from '../../../lib/blocks/expressions/classes'

export interface ExprCompProps<T extends Expr = Expr> {
  expr: T
}
