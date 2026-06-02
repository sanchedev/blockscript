import { createContext } from 'react'
import type { ExprContainer } from '../lib/blocks/shared/classes/expr-container'

export interface ExprContainerContext {
  container: ExprContainer
  triggerUpdate: () => void
}

export const ExprContainerCtx = createContext<ExprContainerContext | undefined>(
  undefined,
)
