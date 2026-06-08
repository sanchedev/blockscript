import { createContext } from 'react'
import type { ExprContainer } from '../lib/blocks/shared/classes/expr-container'
import type { Stmt } from '../lib/blocks/statements'
import type { Expr } from '../lib/blocks/expressions'

export interface ExprContainerContext {
  container: ExprContainer<Stmt | Expr>
}

export const ExprContainerCtx = createContext<ExprContainerContext | undefined>(
  undefined,
)
