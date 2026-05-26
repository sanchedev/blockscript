import { useEffect, useState } from 'react'
import { GlobalStmtCtx } from '../contexts/global-stmt'
import { BlockStmt, Stmt } from '../lib/blocks/statements/classes'
import { editorChanged } from '../lib/event/events'
import { deserialize, serialize } from '../lib/serializer'

function loadInitial(): BlockStmt {
  try {
    const raw = localStorage.getItem('blockscript-save')
    if (raw) {
      const node = deserialize(JSON.parse(raw))
      if (node instanceof BlockStmt) return node
    }
  } catch {
    /* corrupto → nuevo */
  }
  return new BlockStmt()
}

export function GlobalStmtProvider(props: React.PropsWithChildren) {
  const [stmt, setStmt] = useState<BlockStmt>(loadInitial)

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('blockscript-save', JSON.stringify(serialize(stmt)))
    }, 5000)
    return () => clearTimeout(timer)
  }, [stmt])

  useEffect(() => {
    editorChanged.emit()
  }, [stmt])

  const getAt = (...indexes: number[]): Stmt | undefined => {
    let currentBlock: Stmt = stmt

    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i]

      if (currentBlock instanceof BlockStmt) {
        currentBlock = currentBlock.children[index]
        continue
      }

      const block = stmtToBlockStmt(currentBlock)

      if (block == null) return

      currentBlock = block.children[index]
    }

    return currentBlock
  }
  const stmtToBlockStmt = (stmt?: Stmt): BlockStmt | null => {
    if (stmt == null) return null

    if (stmt instanceof BlockStmt) return stmt

    for (const key in stmt) {
      if (!Object.hasOwn(stmt, key)) continue

      const element = stmt[key as keyof typeof stmt]

      if (element instanceof BlockStmt) {
        return element
      }
    }
    return null
  }

  const addAt = (newStmt: Stmt, ...indexes: number[]) => {
    if (indexes.length === 0) return

    const block = stmtToBlockStmt(getAt(...indexes.slice(0, -1)))

    if (block == null) return

    block.children.splice(indexes.at(-1)!, 0, newStmt.copy())
    setStmt(stmt.copy())
  }

  const getParent = (...indexes: number[]) => {
    if (indexes.length === 0) {
      throw new Error(
        'You can not get the parent when you are not in the root.',
      )
    }

    const block = stmtToBlockStmt(getAt(...indexes.slice(0, -1)))

    if (block == null) {
      throw new Error('I do not know how do you do that.')
    }

    return block
  }

  const updateAt = () => {
    setStmt(() => stmt.copy())
  }

  const move = (from: number[], to: number[]) => {
    if (from.length === 0) return

    const fromBlock = stmtToBlockStmt(getAt(...from.slice(0, -1)))

    if (fromBlock == null) return

    const lastIndexFrom = from.at(-1)!
    const newStmt = fromBlock.children.splice(lastIndexFrom, 1)[0]

    if (to.length === 0) return

    const toBlock = stmtToBlockStmt(getAt(...to.slice(0, -1)))

    if (toBlock == null) return

    toBlock.children.splice(to.at(-1)!, 0, newStmt.copy())

    setStmt(() => stmt.copy())
  }

  const replaceAt = (newStmt: Stmt, ...indexes: number[]) => {
    if (indexes.length === 0) return

    const block = stmtToBlockStmt(getAt(...indexes.slice(0, -1)))

    if (block == null) return

    block.children.splice(indexes.at(-1)!, 1, newStmt.copy())
    setStmt(stmt.copy())
  }

  const replaceStmt = (newStmt: BlockStmt) => {
    setStmt(newStmt)
  }

  const removeAt = (...indexes: number[]) => {
    if (indexes.length === 0) return

    const block = stmtToBlockStmt(getAt(...indexes.slice(0, -1)))

    if (block == null) return

    const lastIndex = indexes.at(-1)!
    block.children.splice(lastIndex, 1)

    setStmt(stmt.copy())
  }

  return (
    <GlobalStmtCtx
      value={{
        stmt,
        addAt,
        stmtToBlockStmt,
        getParent,
        updateAt,
        move,
        replaceAt,
        removeAt,
        getAt,
        replaceStmt,
      }}>
      {props.children}
    </GlobalStmtCtx>
  )
}
