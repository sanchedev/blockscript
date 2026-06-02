import { createContext } from 'react'
import type { BlockStmt } from '../lib/blocks/statements/classes'

export interface StmtContext {
  parent?: BlockStmt
  triggerUpdate(): void
}

export const StmtCtx = createContext<StmtContext>({
  parent: undefined!,
  triggerUpdate: undefined!,
})
