import { useRef, useState } from 'react'
import type { ExprContainer } from '../../../lib/blocks/shared/classes/expr-container'
import { ExprComp } from '../expressions/expr'
import clsx from 'clsx'
import { Expr } from '../../../lib/blocks/expressions'
import { ExprContainerCtx } from '../../../contexts/expr-container'
import { useBlockDrag } from '../../../hooks/block-drag'
import { useCurrentDrag, useDrag } from '../../../hooks/drag'
import type { Stmt } from '../../../lib/blocks/statements'
import { useRenderTree } from '../../../hooks/render-tree'

interface ExprContainerCompProps<T extends Stmt | Expr> {
  container: ExprContainer<T>
  disabled: boolean
}

export function ExprContainerComp<T extends Stmt | Expr = Stmt | Expr>({
  container,
  disabled,
}: ExprContainerCompProps<T>) {
  const data = useCurrentDrag()
  const { end } = useDrag()
  const { find, remove } = useBlockDrag()
  const [dragState, setDragState] = useState<'no' | 'ignore' | 'normal'>('no')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const renderTree = useRenderTree()

  const getExpr = () => {
    if (!readyToDrop || data == null) return
    const expr = data.obj
    if (!(expr instanceof Expr)) return
    if (find(expr.id) == null) return
    return expr
  }

  const handleDragOver = (ev: React.DragEvent) => {
    if (disabled) return
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
    if (disabled) return
    ev.preventDefault()
    ev.stopPropagation()
    setDragState('no')
  }
  const handleDrop = (ev: React.DragEvent) => {
    if (disabled) return
    ev.stopPropagation()
    end()
    setDragState('no')
    const expr = getExpr()
    if (expr == null) return
    container.set(expr)
    remove(expr.id)
    renderTree()
  }

  const readyToDrop = container.get() == null

  return (
    <ExprContainerCtx
      value={{
        container: container as unknown as ExprContainer<Stmt | Expr>,
      }}>
      <div
        ref={containerRef}
        className={clsx(
          'expr-container rounded-lg h-6',
          readyToDrop &&
            'min-w-12 text-sm px-4 text-nowrap border border-slate-300 bg-slate-50',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        {container.get() && (
          <ExprComp
            key={container.get()!.id}
            expr={container.get()!}
            disabled={disabled}
          />
        )}
        {readyToDrop && dragState === 'normal' && '¡Suelta Aquí!'}
      </div>
    </ExprContainerCtx>
  )
}
