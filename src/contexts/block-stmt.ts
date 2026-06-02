import { createContext } from 'react'
import type { BlockStmt, Stmt } from '../lib/blocks/statements/classes'

export interface BlockStmtContext {
  block: BlockStmt
  edit: (newStmt: Stmt) => void
  remove: () => void
}

export const BlockStmtCtx = createContext<BlockStmtContext | undefined>(
  undefined,
)
