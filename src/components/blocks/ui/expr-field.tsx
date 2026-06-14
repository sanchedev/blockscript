import { useState } from 'react'
import { useCurrentDrag, useDrag } from '../../../hooks/drag'
import { useTreeStore } from '../../../stores/tree-store'
import type { ExprId } from '../../../lib/ui/exprs'
import type { StmtId } from '../../../lib/ui/stmts'
import clsx from 'clsx'
import { ExprComp } from '../expressions/expr'

interface ExprFieldProps {
  exprId: ExprId
  parentId: string
  field: string
  disabled: boolean
  className?: string
}

export function ExprField({
  exprId,
  parentId,
  field,
  disabled,
  className,
}: ExprFieldProps) {
  const data = useCurrentDrag()
  const { end } = useDrag()
  const [dragState, setDragState] = useState<'no' | 'normal' | 'ignore'>('no')

  const isFilled =
    exprId != null && useTreeStore.getState().exprs[exprId] != null

  if (!isFilled) {
    const readyToDrop = !disabled
    const isDragExpr = data?.id.startsWith('expr') ?? false

    const handleDragOver = (ev: React.DragEvent) => {
      if (!readyToDrop) return
      ev.preventDefault()
      ev.stopPropagation()
      ev.dataTransfer.dropEffect = 'move'
      if (dragState === 'no') {
        setDragState(isDragExpr ? 'normal' : 'ignore')
      }
    }

    const handleDragLeave = (ev: React.DragEvent) => {
      if (!readyToDrop) return
      ev.preventDefault()
      ev.stopPropagation()
      setDragState('no')
    }

    const handleDrop = (ev: React.DragEvent) => {
      if (!readyToDrop || data == null) return
      ev.stopPropagation()
      setDragState('no')
      const droppedId = data.id
      if (!droppedId.startsWith('expr')) return
      data.unlock()
      end()

      const store = useTreeStore.getState()
      const pid = parentId as StmtId | ExprId
      const isStmt = (pid as string).startsWith('stmt')
      if (isStmt) {
        const parent = store.stmts[pid as StmtId]
        if (parent)
          store.setStmt(pid as StmtId, {
            ...parent,
            [field]: droppedId as ExprId,
          })
      } else {
        const parent = store.exprs[pid as ExprId]
        if (parent)
          store.setExpr(pid as ExprId, {
            ...parent,
            [field]: droppedId as ExprId,
          })
      }
    }

    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'expr-field border border-dashed rounded-md min-w-12 h-6 flex items-center justify-center text-xs transition-colors cursor-default select-none',
          dragState === 'normal' &&
            'border-blue-400 bg-blue-50 text-blue-500 text-xs',
          dragState === 'no' &&
            'border-slate-300 bg-slate-50 text-slate-400 text-xs',
          !readyToDrop && 'opacity-40',
          className,
        )}>
        {dragState === 'normal' ? '><' : '?'}
      </div>
    )
  }

  const handleUnlock = () => {
    const store = useTreeStore.getState()
    const pid = parentId as StmtId | ExprId
    const isStmt = (pid as string).startsWith('stmt')
    if (isStmt) {
      const parent = store.stmts[pid as StmtId]
      if (parent)
        store.setStmt(pid as StmtId, {
          ...parent,
          [field]: '' as ExprId,
        })
    } else {
      const parent = store.exprs[pid as ExprId]
      if (parent)
        store.setExpr(pid as ExprId, {
          ...parent,
          [field]: '' as ExprId,
        })
    }
  }

  return <ExprComp id={exprId} disabled={disabled} onUnlock={handleUnlock} />
}
