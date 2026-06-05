import {
  DoWhileStmt,
  ExprStmt,
  ForStmt,
  IfStmt,
  ElseIfStmt,
  ElseStmt,
  WaitStmt,
  WhileStmt,
  PrintStmt,
  VariableStmt,
} from '../../../lib/blocks/statements'
import { DoWhileStmtComp } from './bucles/do-while'
import { ExprStmtComp } from './expresiones/expr'
import { ForStmtComp } from './bucles/for'
import { IfStmtComp } from './condicionales/if'
import { ElseIfStmtComp } from './condicionales/else-if'
import { ElseStmtComp } from './condicionales/else'
import { WaitStmtComp } from './tiempo/wait'
import { WhileStmtComp } from './bucles/while'
import { PrintStmtComp } from './salida/print'
import { VariableStmtComp } from './variables/variable'
import type { StmtCompProps } from './types'
import { useDrag } from '../../../stores/drag-store'
import clsx from 'clsx'
import { StmtCtx } from '../../../contexts/stmt'
import { use, useState } from 'react'
import { BlockStmtCtx } from '../../../contexts/block-stmt'
import { editorChanged } from '../../../lib/event/events'
import { useTransformContext } from 'react-zoom-pan-pinch'
import { StmtSkeleton } from '../ui/skeletons/stmt-skeleton'
import { useBlockDrag } from '../../../hooks/block-drag'

export function StmtComp(
  props: StmtCompProps & { position?: { x: number; y: number } },
) {
  const blockCtx = use(BlockStmtCtx)
  const block = blockCtx?.block
  const edit = blockCtx?.edit
  const remove = blockCtx?.remove
  const [stmt, setStmt] = useState(props.stmt)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const startDrag = useDrag((state) => state.startDrag)
  const data = useDrag((state) => state.data)
  const endDrag = useDrag((state) => state.endDrag)
  const { removeStmt } = useBlockDrag()

  const { state: zoomState } = useTransformContext()

  const id = `stmt=${stmt.id}`
  const handleDragStart = (ev: React.DragEvent) => {
    ev.stopPropagation()
    ev.dataTransfer.setData('text/plain', id)
    ev.dataTransfer.setDragImage(new Image(), 0, 0)
    const { left, top } = ev.currentTarget.getBoundingClientRect()
    startDrag({
      obj: stmt,
      pickPosition: { x: ev.clientX - left, y: ev.clientY - top },
      unlock: () => {
        if (remove) remove()
        else removeStmt(stmt.id)
      },
    })
    calcPosSkeleton(ev.clientX, ev.clientY)
    ev.dataTransfer.dropEffect = 'move'
  }
  const handleDrag = (ev: React.DragEvent) => {
    ev.stopPropagation()
    calcPosSkeleton(ev.clientX, ev.clientY)
  }
  const handleDragEnd = () => {
    endDrag()
  }

  const calcPosSkeleton = (clientX: number, clientY: number) => {
    const { positionX, positionY, scale } = zoomState
    const { x, y } = {
      x: -(clientX + 0),
      y: -(clientY - 64),
    }
    const newX = -(positionX + x) / scale
    const newY = -(positionY + y) / scale
    setPos({ x: newX, y: newY })
  }

  return (
    <StmtCtx
      value={{
        parent: block,
        triggerUpdate: () => {
          const newStmt = stmt.copy()
          edit?.(newStmt)
          setStmt(newStmt)
          editorChanged.emit()
        },
      }}>
      <div
        id={id}
        draggable
        className={clsx('locked', props.position && 'absolute')}
        style={{ top: props.position?.y, left: props.position?.x }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}>
        {data?.obj.id === stmt.id && (
          <div
            className='absolute top-0 left-0 z-50 pointer-events-none'
            style={{
              top: pos.y - (props.position?.y ?? 0),
              left: pos.x - (props.position?.x ?? 0),
              transformOrigin: '0 0',
            }}>
            <StmtSkeleton stmt={stmt} />
          </div>
        )}
        <div
          className={clsx(
            'transition-transform duration-300',
            data?.obj.id === stmt.id && 'opacity-25 scale-0',
          )}>
          {stmt instanceof ExprStmt && <ExprStmtComp stmt={stmt as ExprStmt} />}
          {stmt instanceof PrintStmt && (
            <PrintStmtComp stmt={stmt as PrintStmt} />
          )}
          {stmt instanceof VariableStmt && (
            <VariableStmtComp stmt={stmt as VariableStmt} />
          )}
          {stmt instanceof IfStmt && <IfStmtComp stmt={stmt as IfStmt} />}
          {stmt instanceof ElseIfStmt && (
            <ElseIfStmtComp stmt={stmt as ElseIfStmt} />
          )}
          {stmt instanceof ElseStmt && <ElseStmtComp stmt={stmt as ElseStmt} />}
          {stmt instanceof WhileStmt && (
            <WhileStmtComp stmt={stmt as WhileStmt} />
          )}
          {stmt instanceof DoWhileStmt && (
            <DoWhileStmtComp stmt={stmt as DoWhileStmt} />
          )}
          {stmt instanceof ForStmt && <ForStmtComp stmt={stmt as ForStmt} />}
          {stmt instanceof WaitStmt && <WaitStmtComp stmt={stmt as WaitStmt} />}
        </div>
      </div>
    </StmtCtx>
  )
}
