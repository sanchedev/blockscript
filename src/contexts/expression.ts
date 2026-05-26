import { createContext } from 'react'
import type { Expr } from '../lib/blocks/expressions'
import type { Stmt } from '../lib/blocks/statements'

export interface ExprContext {
  expr: Expr
  parent: Stmt | Expr
  edit(expr: Expr): void
}

export const ExprCtx = createContext<ExprContext>(null!)
