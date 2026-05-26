import { use } from 'react'
import { GlobalStmtCtx } from '../contexts/global-stmt'
import { useLocationPath } from '../contexts/location-path'
import type { Stmt } from '../lib/blocks/statements'

export function useGlobalStmt() {
  const {
    stmt,
    addAt,
    getParent,
    removeAt,
    replaceAt,
    move,
    updateAt,
    getAt,
    stmtToBlockStmt,
    replaceStmt,
  } = use(GlobalStmtCtx)
  const locationPath = useLocationPath()

  const getPathOfParent = () => {
    return locationPath.slice(0, -1).map((l) => l.index)
  }

  return {
    getPathOfParent,
    stmt,
    addAt(stmt: Stmt, ...indexes: number[]) {
      addAt(stmt, ...getPathOfParent(), ...indexes)
    },
    getParent() {
      return getParent(...locationPath.map((l) => l.index))
    },
    replaceAt(stmt: Stmt) {
      replaceAt(stmt, ...locationPath.map((l) => l.index))
    },
    move(...to: number[]) {
      move(
        locationPath.map((l) => l.index),
        to,
      )
    },
    updateAt() {
      updateAt(...locationPath.map((l) => l.index))
    },
    removeAt() {
      removeAt(...locationPath.map((l) => l.index))
    },
    getAt(...indexes: number[]) {
      return getAt(...indexes)
    },
    stmtToBlockStmt,
    replaceStmt,
  }
}
