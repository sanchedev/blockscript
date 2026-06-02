import { create } from 'zustand'
import { BlockStmt } from '../lib/blocks/statements/classes'
import { editorChanged } from '../lib/event/events'

interface RootStmtStore {
  stmt: BlockStmt
  reload: () => void
  setStmt: (stmt: BlockStmt) => void
}

export const useRootStmt = create<RootStmtStore>((set, get) => ({
  stmt: new BlockStmt(),
  reload: () => {
    editorChanged.emit()
    return set({ stmt: get().stmt.copy() })
  },
  setStmt: (stmt: BlockStmt) => set({ stmt }),
}))
