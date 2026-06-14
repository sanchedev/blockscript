import { IconExclamationCircleFilled } from '@tabler/icons-react'
import { useLocationPath } from '../../../hooks/location-path'
import { useError } from '../../../hooks/error'
import type { StmtId } from '../../../lib/ui/stmts'
import { LocationProvider } from '../../../providers/location'
import clsx from 'clsx'
import type { EvalError } from '../../../lib/errors'
import { useState } from 'react'
import { useCurrentDrag, useDrag } from '../../../hooks/drag'
import { useStmtValue } from '../../../hooks/tree'
import { Statements } from '../../../lib/blocks/statements/enum'
import { useTreeStore } from '../../../stores/tree-store'
import { StmtComp } from './stmt'

interface BlockStmtCompProps {
  id: StmtId
  main?: boolean
  fit?: boolean
  disabled?: boolean
}

export function BlockStmtComp({
  id,
  main,
  fit,
  disabled = false,
}: BlockStmtCompProps) {
  const { getErrorByLocation } = useError()
  const locationPath = useLocationPath()
  const data = useCurrentDrag()
  const { end } = useDrag()
  const [dragState, setDragState] = useState<'no' | 'ignore' | 'normal'>('no')
  const [opt] = useStmtValue(id)

  const isIncompatible = (): boolean => {
    if (data == null) return true
    if (opt == null || opt.name !== Statements.Block) return true
    const children = opt.stmts
    const selfId = id
    return children.includes(data.id as StmtId) || data.id === selfId
  }

  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    if (disabled) return

    ev.dataTransfer.dropEffect = 'move'
    if (dragState === 'no') {
      if (isIncompatible()) {
        setDragState('ignore')
      } else {
        setDragState('normal')
      }
    }
  }
  const handleDragLeave = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    setDragState('no')
    if (disabled) return
  }
  const handleDrop = (ev: React.DragEvent) => {
    ev.stopPropagation()
    setDragState('no')
    if (disabled) return

    if (data == null || isIncompatible()) {
      end()
      return
    }
    const droppedId = data.id
    if (!droppedId.startsWith('stmt')) return
    data.unlock()
    end()
    useTreeStore
      .getState()
      .addStmt(useTreeStore.getState().stmts[droppedId as StmtId]!, id)
  }

  const { bg = 'transparent', border = 'border-slate-300' } = {}

  if (opt == null || opt.name !== Statements.Block) return null

  return (
    <div
      className={clsx(
        'stmt-block relative border-l-2 rounded-2xl flex flex-col gap-2 items-start',
        {
          'p-10 shadow bg-slate-100': main,
          'p-4 pl-10 rounded-t-none rounded-b-none': !main,
        },
        border,
        fit && 'w-fit',
        dragState === 'normal' && 'brightness-110',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className={clsx('absolute inset-y-0 left-0 w-9', bg)} />
      {opt.stmts.map((childId, i) => {
        const childOpt = useTreeStore.getState().stmts[childId]
        const selfLoc = {
          index: i,
          stmt: childOpt?.name ?? Statements.Stmt,
        }
        const selfPath = [...locationPath, selfLoc]
        const error = getErrorByLocation(...selfPath)

        return (
          <BlockLine
            key={`lineof ${childId}`}
            error={error}
            index={i}
            childId={childId}
            disabled={disabled}
          />
        )
      })}
      {main && <BlockLine index={opt.stmts.length} disabled />}
    </div>
  )
}

function BlockLine({
  error,
  index,
  childId,
  disabled,
}: {
  error?: EvalError
  index: number
  childId?: StmtId
  disabled: boolean
}) {
  const handleUnlock = () => {
    if (childId == null) return
    useTreeStore.getState().detachStmt(childId)
    // useTreeStore.getState().moveStmt(childId)
  }

  return (
    <div className='relative flex items-start gap-2 h-fit not-hover:[&>button]:hidden'>
      <div
        className={clsx(
          'absolute top-0 -left-8 w-6 h-7 flex items-center justify-end text-right text-sm font-mono select-none pt-1',
          'text-slate-400',
        )}>
        {error ? (
          <IconExclamationCircleFilled
            className='text-red-400'
            title={`${error.type}: ${error.message}`}
          />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
      {childId ? (
        <LocationProvider location={{ index: index, stmt: Statements.Stmt }}>
          <StmtComp
            key={childId}
            id={childId}
            disabled={disabled}
            onUnlock={handleUnlock}
          />
        </LocationProvider>
      ) : (
        <span className='text-slate-400 font-mono'>
          // Arrastra una declaración aquí
        </span>
      )}
    </div>
  )
}
