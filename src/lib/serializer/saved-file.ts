import type { BlockStmt } from '../blocks/statements/classes'
import { BlockStmt as BlockStmtClass } from '../blocks/statements/classes/block-stmt'
import { Stmt } from '../blocks/statements/classes/stmt'
import { Expr } from '../blocks/expressions/classes/expr'

export interface SavedFile {
  version: number
  scattered: {
    expressions: { obj: unknown; position: { x: number; y: number } }[]
    statements: { obj: unknown; position: { x: number; y: number } }[]
  }
  root: unknown
}

export interface SavedFileResult {
  root: BlockStmt | null
  scatteredStmts: { stmt: Stmt; x: number; y: number }[]
  scatteredExprs: { expr: Expr; x: number; y: number }[]
}

export function exportSavedFile(
  root: BlockStmt,
  stmtPositions: { stmt: Stmt; x: number; y: number }[],
  exprPositions: { expr: Expr; x: number; y: number }[],
): SavedFile {
  return {
    version: 0,
    scattered: {
      expressions: exprPositions.map(({ expr, x, y }) => ({
        obj: expr.export(),
        position: { x, y },
      })),
      statements: stmtPositions.map(({ stmt, x, y }) => ({
        obj: stmt.export(),
        position: { x, y },
      })),
    },
    root: root.export(),
  }
}

export function loadSavedFile(data: SavedFile): SavedFileResult {
  const root = BlockStmtClass.createFrom(data.root)

  const scatteredExprs: SavedFileResult['scatteredExprs'] = []
  for (const item of data.scattered?.expressions ?? []) {
    const expr = Expr.createFrom(item.obj)
    if (expr) {
      scatteredExprs.push({ expr, x: item.position.x, y: item.position.y })
    }
  }

  const scatteredStmts: SavedFileResult['scatteredStmts'] = []
  for (const item of data.scattered?.statements ?? []) {
    const stmt = Stmt.createFrom(item.obj)
    if (stmt) {
      scatteredStmts.push({ stmt, x: item.position.x, y: item.position.y })
    }
  }

  return { root, scatteredStmts, scatteredExprs }
}
