import { createContext } from 'react'
import type { BlockStmt, Stmt } from '../lib/blocks/statements/classes'

interface GlobalStmtContext {
  stmt: BlockStmt
  addAt(stmt: Stmt, ...indexes: number[]): void
  getParent(...indexes: number[]): BlockStmt
  replaceAt(stmt: Stmt, ...indexes: number[]): void
  move(from: number[], to: number[]): void
  updateAt(...indexes: number[]): void
  removeAt(...indexes: number[]): void
  getAt(...indexes: number[]): Stmt | undefined
  stmtToBlockStmt: (stmt?: Stmt | undefined) => BlockStmt | null
  replaceStmt(stmt: BlockStmt): void
}

export const GlobalStmtCtx = createContext<GlobalStmtContext>({
  stmt: null!,
  addAt() {},
  getParent() {
    return null!
  },
  replaceAt() {},
  move() {},
  updateAt() {},
  removeAt() {},
  getAt() {},
  stmtToBlockStmt() {
    return null
  },
  replaceStmt() {},
})
