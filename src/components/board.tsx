import { useTransformContext } from 'react-zoom-pan-pinch'
import { ExprComp } from './blocks/expressions/expr'
import { StmtComp } from './blocks/statements/stmt'
import { BlockStmtComp } from './blocks/statements/block'
import { useBlockDrag, useBlockDragPositions } from '../hooks/block-drag'
import { useCurrentDrag, useDrag } from '../hooks/drag'
import { DragSkeleton } from './blocks/ui/skeletons/drag-skeleton'
import { useTreeStore } from '../stores/tree-store'
import type { ExprId } from '../lib/ui/exprs'
import type { StmtId } from '../lib/ui/stmts'

export function Board() {
  const rootId = useTreeStore((s) => s.rootId)
  const { add, move, has } = useBlockDrag()
  const data = useCurrentDrag()
  const { end } = useDrag()
  const { state } = useTransformContext()

  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    end()

    if (data == null) return

    const { positionX, positionY, scale } = state

    const x = (positionX - ev.clientX + data.pickPosition.x + 0) / scale
    const y = (positionY - ev.clientY + data.pickPosition.y + 64) / scale

    const dragId = data.id

    if (!has(dragId)) {
      data.unlock()
      add(dragId, x, y)
    } else {
      move(dragId, x, y)
    }
  }

  return (
    <main
      id='board'
      className='relative px-480 py-480 w-5000 h-5000'
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      <DragSkeleton />
      <BlockDrags />
      <BlockStmtComp id={rootId} main fit disabled={false} />
    </main>
  )
}

function BlockDrags() {
  const positions = useBlockDragPositions()
  const stmts = useTreeStore((s) => s.stmts)
  const exprs = useTreeStore((s) => s.exprs)

  return positions.map(({ id, x, y }) => {
    if (id in exprs) {
      return (
        <ExprComp
          key={id}
          id={id as ExprId}
          position={{ x: -x, y: -y }}
          disabled={false}
        />
      )
    }
    if (id in stmts) {
      return (
        <StmtComp
          key={id}
          id={id as StmtId}
          position={{ x: -x, y: -y }}
          disabled={false}
        />
      )
    }
    return null
  })
}
