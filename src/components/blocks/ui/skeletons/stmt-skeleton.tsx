import type { Stmt } from '../../../../lib/blocks/statements'
import {
  BlockStmt,
  BreakStmt,
  ContinueStmt,
  DoWhileStmt,
  ElseIfStmt,
  ElseStmt,
  ExprStmt,
  ForStmt,
  IfStmt,
  PrintStmt,
  VariableStmt,
  WaitStmt,
  WhileStmt,
} from '../../../../lib/blocks/statements'
import {
  getStmtGroupKey,
  statementsGroups,
} from '../../../../lib/blocks/statements/records/groups'
import { blockColorMap } from '../../../../lib/theme'
import { ExprSkeleton } from './expr-skeleton'
import clsx from 'clsx'

export function StmtSkeleton({ stmt }: { stmt: Stmt }) {
  const groupKey = getStmtGroupKey(stmt.name)
  const group = statementsGroups[groupKey]
  const styles = blockColorMap[group.blockColor]

  const blockClass = clsx(
    'border-l-2 rounded-xl px-3 py-1.5 font-mono text-sm flex items-center gap-2 w-fit',
    styles.bg,
    styles.text,
    styles.border,
  )

  if (stmt instanceof BlockStmt) {
    return (
      <div className={clsx('flex flex-col gap-1', stmt.children.length > 0 && 'pl-4 border-l-2 border-slate-300')}>
        {stmt.children.length > 0 ? (
          stmt.children.map((child, i) => (
            <StmtSkeleton key={child.id || i} stmt={child} />
          ))
        ) : (
          <span className='text-slate-400 text-xs italic'>...</span>
        )}
      </div>
    )
  }

  if (stmt instanceof PrintStmt) {
    return (
      <div className={blockClass}>
        <span>imprimir</span>
        <SlotExpr expr={stmt.expression.get()} />
      </div>
    )
  }

  if (stmt instanceof ExprStmt) {
    return (
      <div className={blockClass}>
        <SlotExpr expr={stmt.expression.get()} />
      </div>
    )
  }

  if (stmt instanceof VariableStmt) {
    return (
      <div className={blockClass}>
        <span>{stmt.identifier || 'variable'}</span>
        <span className='text-slate-500'>=</span>
        <SlotExpr expr={stmt.expression.get()} />
      </div>
    )
  }

  if (stmt instanceof IfStmt) {
    return (
      <div>
        <div className={clsx(blockClass, 'rounded-b-none')}>
          <span>si</span>
          <SlotExpr expr={stmt.condition.get()} />
          <span>entonces</span>
        </div>
        <div className='ml-4 border-l-2 border-slate-300 pl-2'>
          <StmtSkeleton stmt={stmt.thenBody} />
        </div>
      </div>
    )
  }

  if (stmt instanceof ElseIfStmt) {
    return (
      <div>
        <div className={clsx(blockClass, 'rounded-b-none')}>
          <span>o si</span>
          <SlotExpr expr={stmt.condition.get()} />
        </div>
        <div className='ml-4 border-l-2 border-slate-300 pl-2'>
          <StmtSkeleton stmt={stmt.body} />
        </div>
      </div>
    )
  }

  if (stmt instanceof ElseStmt) {
    return (
      <div>
        <div className={blockClass}>
          <span>si no</span>
        </div>
        <div className='ml-4 border-l-2 border-slate-300 pl-2'>
          <StmtSkeleton stmt={stmt.body} />
        </div>
      </div>
    )
  }

  if (stmt instanceof WhileStmt) {
    return (
      <div>
        <div className={clsx(blockClass, 'rounded-b-none')}>
          <span>mientras</span>
          <SlotExpr expr={stmt.condition.get()} />
        </div>
        <div className='ml-4 border-l-2 border-slate-300 pl-2'>
          <StmtSkeleton stmt={stmt.body} />
        </div>
      </div>
    )
  }

  if (stmt instanceof DoWhileStmt) {
    return (
      <div>
        <div className={clsx(blockClass, 'rounded-b-none')}>
          <span>hacer</span>
        </div>
        <div className='ml-4 border-l-2 border-slate-300 pl-2'>
          <StmtSkeleton stmt={stmt.body} />
        </div>
        <div className={blockClass}>
          <span>mientras</span>
          <SlotExpr expr={stmt.condition.get()} />
        </div>
      </div>
    )
  }

  if (stmt instanceof ForStmt) {
    return (
      <div>
        <div className={clsx(blockClass, 'rounded-b-none flex-wrap')}>
          <span>para</span>
          <span className='bg-white/50 rounded px-1'>{stmt.identifier || 'i'}</span>
          <span>desde</span>
          <SlotExpr expr={stmt.start.get()} />
          <span>hasta</span>
          <SlotExpr expr={stmt.end.get()} />
          <span>paso</span>
          <SlotExpr expr={stmt.step.get()} />
        </div>
        <div className='ml-4 border-l-2 border-slate-300 pl-2'>
          <StmtSkeleton stmt={stmt.body} />
        </div>
      </div>
    )
  }

  if (stmt instanceof WaitStmt) {
    return (
      <div className={blockClass}>
        <span>esperar</span>
        <SlotExpr expr={stmt.duration.get()} />
        <span className='text-xs'>ms</span>
      </div>
    )
  }

  if (stmt instanceof BreakStmt) {
    return (
      <div className={blockClass}>
        <span>romper</span>
      </div>
    )
  }

  if (stmt instanceof ContinueStmt) {
    return (
      <div className={blockClass}>
        <span>continuar</span>
      </div>
    )
  }

  return (
    <div className={blockClass}>
      <span>?</span>
    </div>
  )
}

function SlotExpr({ expr }: { expr: import('../../../../lib/blocks/expressions').Expr | null }) {
  if (expr) return <ExprSkeleton expr={expr} />
  return (
    <span className='inline-block min-w-8 h-5 rounded border border-dashed border-slate-300 bg-slate-50' />
  )
}
