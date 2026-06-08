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
import clsx from 'clsx'
import { StmtCtx } from '../../../contexts/stmt'
import { use } from 'react'
import { BlockStmtCtx } from '../../../contexts/block-stmt'
import { BlockDrag } from '../ui/block-drag'

export function StmtComp({
  stmt,
  disabled,
  position,
  className,
  ...rest
}: StmtCompProps & {
  position?: { x: number; y: number }
} & React.HTMLAttributes<HTMLDivElement>) {
  const blockCtx = use(BlockStmtCtx)
  const block = blockCtx?.block
  const remove = blockCtx?.remove

  return (
    <StmtCtx
      value={{
        parent: block,
      }}>
      <BlockDrag
        obj={stmt}
        disabled={disabled}
        onRemove={() => remove != null && (remove() ?? true)}
        className={clsx(position && 'absolute', className)}
        style={{ top: position?.y, left: position?.x }}
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
      </BlockDrag>
    </StmtCtx>
  )
}
