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
  scatteredStmts: { block: Stmt; x: number; y: number }[]
  scatteredExprs: { block: Expr; x: number; y: number }[]
}

export function exportSavedFile(
  root: BlockStmt,
  positions: { block: Stmt | Expr; x: number; y: number }[],
): SavedFile {
  const exportedExprs: SavedFile['scattered']['expressions'] = []
  const exportedStmts: SavedFile['scattered']['statements'] = []

  for (const { block, x, y } of positions) {
    const exported = {
      obj: block.export(),
      position: { x, y },
    }
    if (block instanceof Expr) {
      exportedExprs.push(exported)
    } else {
      exportedStmts.push(exported)
    }
  }

  return {
    version: 0,
    scattered: {
      expressions: exportedExprs,
      statements: exportedStmts,
    },
    root: root.export(),
  }
}

export function loadSavedFile(data: SavedFile): SavedFileResult {
  const root = BlockStmtClass.createFrom(data.root)

  const scatteredExprs: SavedFileResult['scatteredExprs'] = []
  for (const item of data.scattered?.expressions ?? []) {
    const block = Expr.createFrom(item.obj)
    if (block) {
      scatteredExprs.push({ block, x: item.position.x, y: item.position.y })
    }
  }

  const scatteredStmts: SavedFileResult['scatteredStmts'] = []
  for (const item of data.scattered?.statements ?? []) {
    const block = Stmt.createFrom(item.obj)
    if (block) {
      scatteredStmts.push({ block, x: item.position.x, y: item.position.y })
    }
  }

  return { root, scatteredStmts, scatteredExprs }
}
