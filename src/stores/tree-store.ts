import { create } from 'zustand'
import type { StmtId, StmtOptions } from '../lib/ui/stmts'
import type { ExprId, ExprOptions } from '../lib/ui/exprs'
import { Statements } from '../lib/blocks/statements/enum'
import { Expressions } from '../lib/blocks/expressions/enum'

export interface TreeStore {
  stmts: Record<StmtId, StmtOptions>
  exprs: Record<ExprId, ExprOptions>
  rootId: StmtId

  addStmt(stmt: StmtOptions, parentId?: StmtId, index?: number): void
  moveStmt(id: StmtId, toParentId?: StmtId, toIndex?: number): void

  setStmt(id: StmtId, stmt: StmtOptions): void
  setExpr(id: ExprId, expr: ExprOptions): void

  removeStmt(id: StmtId): void
  removeExpr(id: ExprId): void

  detachStmt(id: StmtId): void
  detachExpr(id: ExprId, parentId: StmtId | ExprId, field: string): void
}

const defaultRoot: StmtOptions = {
  id: `stmt=${crypto.randomUUID()}`,
  name: Statements.Block,
  stmts: [],
}

export const useTreeStore = create<TreeStore>((set) => ({
  stmts: { [defaultRoot.id]: defaultRoot },
  exprs: {},
  rootId: defaultRoot.id,

  addStmt(stmt, parentId, index) {
    set((s) => {
      if (parentId == null) return { stmts: { ...s.stmts, [stmt.id]: stmt } }

      const parent = s.stmts[parentId]
      if (parent == null || parent.name !== Statements.Block) return s

      const next: StmtOptions = {
        ...parent,
        stmts:
          index != null
            ? parent.stmts.toSpliced(index, 0, stmt.id)
            : [...parent.stmts, stmt.id],
      }

      return {
        stmts: { ...s.stmts, [parent.id]: next, [stmt.id]: stmt },
      }
    })
  },
  moveStmt(id, toParentId, toIndex) {
    set((s) => {
      const stmts = { ...s.stmts }

      const fromParent = Object.values(stmts).find(
        (st) => st.name === Statements.Block && st.stmts.includes(id),
      )

      if (fromParent != null && fromParent.name === Statements.Block) {
        stmts[fromParent.id] = {
          ...fromParent,
          stmts: fromParent.stmts.filter((c) => c !== id),
        }
      }

      const to = toParentId != null ? stmts[toParentId] : undefined

      if (to != null && to.name === Statements.Block) {
        const arr = [...to.stmts]
        if (toIndex == null) {
          arr.push(id)
        } else {
          arr.splice(toIndex, 0, id)
        }
        stmts[toParentId!] = { ...to, stmts: arr }
      }

      return { stmts }
    })
  },

  setStmt(id, stmt) {
    set((s) => ({ stmts: { ...s.stmts, [id]: stmt } }))
  },
  setExpr(id, expr) {
    set((s) => ({ exprs: { ...s.exprs, [id]: expr } }))
  },

  removeStmt(id) {
    set((s) => {
      const stmtsToRemove = new Set<StmtId>()
      const exprsToRemove = new Set<ExprId>()

      const walkStmt = (id: StmtId) => {
        if (stmtsToRemove.has(id)) return
        stmtsToRemove.add(id)
        const stmt = s.stmts[id]
        if (stmt == null) return
        getExprIdsFromStmt(stmt).forEach(walkExpr)
        getChildStmtIds(stmt).forEach(walkStmt)
      }
      const walkExpr = (id: ExprId) => {
        if (exprsToRemove.has(id)) return
        exprsToRemove.add(id)
        const expr = s.exprs[id]
        if (expr == null) return
        getChildExprIds(expr).forEach(walkExpr)
      }

      walkStmt(id)

      const newStmts = { ...s.stmts }
      const newExprs = { ...s.exprs }
      stmtsToRemove.forEach((si) => delete newStmts[si])
      exprsToRemove.forEach((ei) => delete newExprs[ei])

      const newRootId: StmtId =
        id === s.rootId ? `stmt=${crypto.randomUUID()}` : s.rootId
      if (id === s.rootId) {
        newStmts[newRootId] = {
          id: newRootId,
          name: Statements.Block,
          stmts: [],
        }
      }

      return { stmts: newStmts, exprs: newExprs, rootId: newRootId }
    })
  },
  removeExpr(id) {
    set((s) => {
      const exprsToRemove = new Set<ExprId>()

      const walkExpr = (id: ExprId) => {
        if (exprsToRemove.has(id)) return
        exprsToRemove.add(id)
        const expr = s.exprs[id]
        if (expr == null) return
        getChildExprIds(expr).forEach(walkExpr)
      }

      walkExpr(id)

      const newExprs = { ...s.exprs }
      exprsToRemove.forEach((ei) => delete newExprs[ei])

      return { exprs: newExprs }
    })
  },

  detachStmt(id) {
    set((s) => {
      const stmts = { ...s.stmts }
      for (const [sid, st] of Object.entries(stmts)) {
        if (st.name === Statements.Block && st.stmts.includes(id)) {
          stmts[sid as StmtId] = {
            ...st,
            stmts: st.stmts.filter((c) => c !== id),
          }
        }
      }
      return { stmts }
    })
  },
  detachExpr(_, parentId, field) {
    set((s) => {
      const isStmt = (parentId as string).startsWith('stmt')
      const isExpr = (parentId as string).startsWith('expr')
      const parent = isStmt
        ? s.stmts[parentId as StmtId]
        : isExpr
          ? s.exprs[parentId as ExprId]
          : undefined
      if (parent == null) return s

      const updated = { ...parent, [field]: '' as ExprId }

      if (isStmt) {
        return {
          stmts: {
            ...s.stmts,
            [parentId as unknown as StmtId]: updated as StmtOptions,
          },
        }
      }
      return {
        exprs: {
          ...s.exprs,
          [parentId as unknown as ExprId]: updated as ExprOptions,
        },
      }
    })
  },
}))

export function getChildStmtIds(stmt: StmtOptions): StmtId[] {
  switch (stmt.name) {
    case Statements.Block:
      return [...stmt.stmts]
    case Statements.DoWhile:
    case Statements.Else:
    case Statements.ElseIf:
    case Statements.If:
    case Statements.For:
    case Statements.While:
      return [stmt.body]
    default:
      return []
  }
}

export function getExprIdsFromStmt(stmt: StmtOptions): ExprId[] {
  switch (stmt.name) {
    case Statements.Expr:
    case Statements.Variable:
    case Statements.Print:
      return [stmt.expr]
    case Statements.If:
    case Statements.ElseIf:
    case Statements.While:
    case Statements.DoWhile:
      return [stmt.condition]
    case Statements.For:
      return [stmt.start, stmt.end, stmt.step]
    case Statements.Wait:
      return [stmt.duration]
    default:
      return []
  }
}

export function getChildExprIds(expr: ExprOptions): ExprId[] {
  switch (expr.name) {
    case Expressions.Read:
      return [expr.prompt]
    case Expressions.Binary:
    case Expressions.BinaryComp:
    case Expressions.Logical:
    case Expressions.Concat:
      return [expr.left, expr.right]
    case Expressions.Assign:
    case Expressions.AssignOp:
    case Expressions.ToString:
    case Expressions.ToNumber:
    case Expressions.ToBoolean:
      return [expr.expr]
    default:
      return []
  }
}
