import {
  BreakStmt,
  ContinueStmt,
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
import { BreakStmtComp } from './bucles/break'
import { ContinueStmtComp } from './bucles/continue'
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
import clsx from 'clsx'
import { StmtCtx } from '../../../contexts/stmt'
import { use } from 'react'
import { BlockStmtCtx } from '../../../contexts/block-stmt'
import { BlockDrag, type BlockDragElement } from '../ui/block-drag'
import { useBlockDrag } from '../../../hooks/block-drag'
import { useRenderTree } from '../../../hooks/render-tree'
import { IconTrash } from '@tabler/icons-react'

export function StmtComp({
  stmt,
  disabled,
  position,
  className,
  ...rest
}: StmtCompProps & {
  position?: { x: number; y: number }
} & BlockDragElement) {
  const blockCtx = use(BlockStmtCtx)
  const block = blockCtx?.block
  const remove = blockCtx?.remove

  const { remove: removeDrag } = useBlockDrag()
  const renderTree = useRenderTree()

  const handleRemove = () => {
    if (remove != null) remove()
    else removeDrag(stmt.id)

    renderTree()
  }

  return (
    <StmtCtx
      value={{
        parent: block,
      }}>
      <BlockDrag
        obj={stmt}
        disabled={disabled}
        onRemove={handleRemove}
        contextMenuOptions={[
          {
            icon: IconTrash,
            label: 'Eliminar',
            variant: 'destructive',
            action: handleRemove,
          },
        ]}
        className={clsx(position && 'absolute', className)}
        style={
          position
            ? {
                top: position.y,
                left: position.x,
              }
            : undefined
        }
        {...rest}>
        {stmt instanceof ExprStmt && (
          <ExprStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof PrintStmt && (
          <PrintStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof VariableStmt && (
          <VariableStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof IfStmt && (
          <IfStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof ElseIfStmt && (
          <ElseIfStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof ElseStmt && (
          <ElseStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof WhileStmt && (
          <WhileStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof DoWhileStmt && (
          <DoWhileStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof ForStmt && (
          <ForStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof WaitStmt && (
          <WaitStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof BreakStmt && (
          <BreakStmtComp stmt={stmt} disabled={disabled} />
        )}
        {stmt instanceof ContinueStmt && (
          <ContinueStmtComp stmt={stmt} disabled={disabled} />
        )}
      </BlockDrag>
    </StmtCtx>
  )
}
