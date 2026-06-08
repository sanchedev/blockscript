import { createContext } from 'react'
import type { BlockStmt } from '../lib/blocks/statements/classes'

export interface StmtContext {
  parent?: BlockStmt
}

export const StmtCtx = createContext<StmtContext>({
  parent: undefined!,
})
