import { serialize } from '../lib/serializer'
import type { BlockStmt } from '../lib/blocks/statements/classes'

export function usePersistence(stmt: BlockStmt) {
  const exportToFile = () => {
    const data = serialize(stmt)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blockscript-${new Date().toISOString().slice(0, 10)}.bs`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { exportToFile }
}
