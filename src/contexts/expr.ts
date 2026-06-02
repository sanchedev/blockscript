import { createContext } from 'react'
import type { Expr } from '../lib/blocks/expressions'
import type { Stmt } from '../lib/blocks/statements'

export interface ExprContext {
  parent?: Stmt | Expr
  triggerUpdate(): void
}

export const ExprCtx = createContext<ExprContext>({
  parent: undefined!,
  triggerUpdate: undefined!,
})
