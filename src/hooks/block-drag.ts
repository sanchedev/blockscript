import { Expr } from '../lib/blocks/expressions'
import { Stmt } from '../lib/blocks/statements'
import { useBlockDragStore } from '../stores/block-drag-store'

export function useBlockDrag() {
  const positions = useBlockDragStore((state) => state.positions)
  const add = useBlockDragStore((state) => state.add)
  const move = useBlockDragStore((state) => state.move)
  const remove = useBlockDragStore((state) => state.remove)
  const find = useBlockDragStore((state) => state.find)
  const has = useBlockDragStore((state) => state.has)

  const isExpr = (id: string) => find(id) instanceof Expr
  const isStmt = (id: string) => find(id) instanceof Stmt

  const findExpr = (id: string) => (isExpr(id) ? find(id) : undefined)
  const findStmt = (id: string) => (isStmt(id) ? find(id) : undefined)

  const removeExpr = (id: string) => isExpr(id) && remove(id)
  const removeStmt = (id: string) => isStmt(id) && remove(id)

  return {
    positions,
    add,
    move,
    remove,
    find,
    has,

    isExpr,
    isStmt,
    findExpr,
    findStmt,
    removeExpr,
    removeStmt,
  }
}
