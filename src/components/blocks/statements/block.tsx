import { IconExclamationCircleFilled } from '@tabler/icons-react'
import { useLocationPath } from '../../../contexts/location-path'
import { useError } from '../../../hooks/error'
import { Stmt, type BlockStmt } from '../../../lib/blocks/statements/classes'
import type { StmtCompProps } from './types'
import { LocationProvider } from '../../../providers/location'
import clsx from 'clsx'
import type { EvalError } from '../../../lib/errors'
import { StmtComp } from './stmt'
import { use, useState } from 'react'
import { useDrag } from '../../../stores/drag-store'
import { BlockStmtCtx } from '../../../contexts/block-stmt'
import { StmtCtx } from '../../../contexts/stmt'
import { useRootStmt } from '../../../stores/root-stmt'

export function BlockStmtComp(
  props: StmtCompProps<BlockStmt> & {
    parent?: Stmt
    main?: boolean
    removeRoundedTop?: boolean
    removeRoundedBottom?: boolean
    fit?: boolean
  },
) {
  const { getErrorByLocation } = useError()
  const locationPath = useLocationPath()

  const data = useDrag((state) => state.data)
  const endDrag = useDrag((state) => state.endDrag)
  const [dragState, setDragState] = useState<'no' | 'ignore' | 'normal'>('no')

  const reload = useRootStmt((state) => state.reload)
  const { triggerUpdate = reload } = use(StmtCtx)

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
    if (!stmt) return false
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
    if (dropped == null) { endDrag(); return }
    if (isIncompatible()) { endDrag(); return }
    add(dropped)
    endDrag()
    data?.unlock()
    triggerUpdate()
  }

  return (
    <div
      className={clsx(
        'stmt-block border-l-2 border-slate-300 bg-slate-100 rounded-2xl p-10 flex flex-col gap-2 items-start shadow',
        {
          'rounded-t-none': props.removeRoundedTop,
          'rounded-b-none': props.removeRoundedBottom,
        },
        props.fit && 'w-fit',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
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
                triggerUpdate()
              },
              remove: () => {
                deleteStmt(i)
                triggerUpdate()
              },
            }}>
            <BlockLine key={stmt.id} error={error} index={i} stmt={stmt} />
          </BlockStmtCtx>
        )
      })}
      <BlockLine index={props.stmt.children.length} />
    </div>
  )
}

function BlockLine({
  error,
  index,
  stmt,
}: {
  error?: EvalError
  index: number
  stmt?: Stmt
}) {
  return (
    <div className='-ml-8 flex items-center gap-2 h-fit not-hover:[&>button]:hidden'>
      <div className='w-6 h-full flex items-center justify-end text-right text-sm font-mono text-slate-400 select-none pt-1'>
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
          <StmtComp key={stmt.id} stmt={stmt} />
        </LocationProvider>
      ) : (
        <span className='text-slate-400 font-mono'>
          // Arrastra una declaración aquí
        </span>
      )}
    </div>
  )
}
