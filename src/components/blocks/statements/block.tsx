import { IconExclamationCircleFilled } from '@tabler/icons-react'
import { useLocationPath } from '../../../hooks/location-path'
import { useError } from '../../../hooks/error'
import { Stmt, type BlockStmt } from '../../../lib/blocks/statements/classes'
import type { StmtCompProps } from './types'
import { LocationProvider } from '../../../providers/location'
import clsx from 'clsx'
import type { EvalError } from '../../../lib/errors'
import { StmtComp } from './stmt'
import { useState } from 'react'
import { BlockStmtCtx } from '../../../contexts/block-stmt'
import { getStmtGroupColor } from '../../../lib/blocks/statements/records/groups'
import { useCurrentDrag, useDrag } from '../../../hooks/drag'
import { useRenderTree } from '../../../hooks/render-tree'

export function BlockStmtComp(
  props: StmtCompProps<BlockStmt> & {
    parent?: Stmt
    main?: boolean
    fit?: boolean
  },
) {
  const { getErrorByLocation } = useError()
  const locationPath = useLocationPath()

  const data = useCurrentDrag()
  const { end } = useDrag()
  const [dragState, setDragState] = useState<'no' | 'ignore' | 'normal'>('no')

  const renderTree = useRenderTree()

  const add = (stmt: Stmt, index?: number) => {
    if (stmt == null) return
    if (index == null) props.stmt.children.push(stmt)
    else props.stmt.children.splice(index, 0, stmt)
  }
  const set = (stmt: Stmt, index: number) => {
    props.stmt.children.splice(index, 1, stmt)
  }
  const deleteStmt = (index: number) => {
    props.stmt.children.splice(index, 1)
  }

  const getStmt = () => {
    if (data == null) return
    const stmt = data.obj
    if (!(stmt instanceof Stmt)) return
    return stmt
  }
  const isIncompatible = () => {
    const stmt = getStmt()
    if (!stmt) return true
    return (
      props.stmt.children.includes(stmt) ||
      stmt === props.stmt ||
      stmt === props.parent
    )
  }

  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
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
  }
  const handleDrop = (ev: React.DragEvent) => {
    ev.stopPropagation()
    setDragState('no')
    const dropped = getStmt()
    if (dropped == null || isIncompatible()) {
      end()
      return
    }
    data?.unlock()
    end()
    add(dropped)
    renderTree()
  }
  const { bg = 'transparent', border = 'border-slate-300' } = props.parent
    ? getStmtGroupColor(props.parent.name)
    : {}

  return (
    <div
      className={clsx(
        'stmt-block relative border-l-2 rounded-2xl flex flex-col gap-2 items-start',
        {
          'p-10 shadow bg-slate-100': props.main,
          'p-4 pl-10 rounded-t-none rounded-b-none': !props.main,
        },
        border,
        props.fit && 'w-fit',
        dragState === 'normal' && 'brightness-110',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className={clsx('absolute inset-y-0 left-0 w-9', bg)} />
      {props.stmt.children.map((stmt, i) => {
        const selfLoc = {
          index: i,
          stmt: stmt.name,
        }
        const selfPath = [...locationPath, selfLoc]
        const error = getErrorByLocation(...selfPath)

        return (
          <BlockStmtCtx
            key={`bsc-${stmt.id}`}
            value={{
              block: props.stmt,
              edit: (newStmt) => {
                set(newStmt, i)
                renderTree()
              },
              remove: () => {
                deleteStmt(i)
                renderTree()
              },
            }}>
            <BlockLine
              key={`lineof ${stmt.id}`}
              error={error}
              index={i}
              stmt={stmt}
              parent={props.parent}
            />
          </BlockStmtCtx>
        )
      })}
      {props.main && <BlockLine index={props.stmt.children.length} />}
    </div>
  )
}

function BlockLine({
  error,
  index,
  stmt,
  parent,
}: {
  error?: EvalError
  index: number
  stmt?: Stmt
  parent?: Stmt
}) {
  const { text = 'text-slate-400' } = parent
    ? getStmtGroupColor(parent.name)
    : {}
  return (
    <div className='relative flex items-start gap-2 h-fit not-hover:[&>button]:hidden'>
      <div
        className={clsx(
          'absolute top-0 -left-8 w-6 h-7 flex items-center justify-end text-right text-sm font-mono select-none pt-1',
          text,
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
      {stmt ? (
        <LocationProvider location={{ index: index, stmt: stmt.name }}>
          <StmtComp key={stmt.id} stmt={stmt} disabled={false} />
        </LocationProvider>
      ) : (
        <span className='text-slate-400 font-mono'>
          // Arrastra una declaración aquí
        </span>
      )}
    </div>
  )
}
