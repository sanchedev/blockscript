import { use, useRef, useState } from 'react'
import type { ExprContainer } from '../../../lib/blocks/shared/classes/expr-container'
import { ExprComp } from '../expressions/expr'
import { useDrag } from '../../../stores/drag-store'
import clsx from 'clsx'
import { useExprDrag } from '../../../stores/expr-drags'
import { Expr } from '../../../lib/blocks/expressions'
import { ExprContainerCtx } from '../../../contexts/expr-container'
import { StmtCtx } from '../../../contexts/stmt'
import { ExprCtx } from '../../../contexts/expr'

interface ExprContainerCompProps {
  container: ExprContainer
}

export function ExprContainerComp({ container }: ExprContainerCompProps) {
  const data = useDrag((state) => state.data)
  const endDrag = useDrag((state) => state.endDrag)
  const find = useExprDrag((state) => state.find)
  const remove = useExprDrag((state) => state.remove)
  const [dragState, setDragState] = useState<'no' | 'ignore' | 'normal'>('no')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { triggerUpdate: updateStmt } = use(StmtCtx)
  const { triggerUpdate: updateExpr } = use(ExprCtx)
  const triggerUpdate = () => {
    if (updateExpr) {
      updateExpr()
    } else {
      updateStmt?.()
    }
  }

  const getExpr = () => {
    if (!readyToDrop || data == null) return
    const expr = data.obj
    if (!(expr instanceof Expr)) return
    if (find(expr.id) == null) return
    return expr
  }

  const handleDragOver = (ev: React.DragEvent) => {
    if (containerRef.current == null) return
    if (containerRef.current.children.length > 0) return

    ev.preventDefault()
    ev.stopPropagation()
    ev.dataTransfer.dropEffect = 'move'
    if (dragState === 'no') {
      const expr = getExpr()
      if (expr == null) setDragState('ignore')
      else setDragState('normal')
    }
  }
  const handleDragLeave = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    setDragState('no')
  }
  const handleDrop = (ev: React.DragEvent) => {
    ev.stopPropagation()
    endDrag()
    setDragState('no')
    const expr = getExpr()
    if (expr == null) return
    container.set(expr)
    remove(expr.id)
    triggerUpdate()
  }

  const readyToDrop = container.get() == null

  return (
    <ExprContainerCtx
      value={{
        container,
        triggerUpdate,
      }}>
      <div
        ref={containerRef}
        className={clsx(
          'expr-container border-2 border-slate-300 bg-slate-50 rounded-xl min-h-8 overflow-hidden',
          readyToDrop && 'min-w-24 px-4 text-nowrap',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        {container.get() && (
          <ExprComp key={container.get()!.id} expr={container.get()!} />
        )}
        {readyToDrop && dragState === 'normal' && '¡Suelta Aquí!'}
      </div>
    </ExprContainerCtx>
  )
}
