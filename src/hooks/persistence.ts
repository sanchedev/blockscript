import { exportSavedFile } from '../lib/serializer/saved-file'
import type { BlockStmt } from '../lib/blocks/statements/classes'
import type { Stmt } from '../lib/blocks/statements/classes/stmt'
import type { Expr } from '../lib/blocks/expressions/classes/expr'

export function usePersistence(
  stmt: BlockStmt,
  drags: { block: Stmt | Expr; x: number; y: number }[],
) {
  const exportToFile = () => {
    const data = exportSavedFile(stmt, drags)
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blockscript-${new Date().toISOString().slice(0, 10)}.bs`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { exportToFile }
}
