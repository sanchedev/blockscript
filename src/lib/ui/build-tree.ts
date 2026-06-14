import { useTreeStore, type TreeStore } from '../../stores/tree-store'
import type { Expr } from '../blocks/expressions'
import { Expressions } from '../blocks/expressions/enum'
import { expressionsClasses } from '../blocks/expressions/records/classes'
import type { VisitorExpr, VisitorStmt } from '../blocks/shared/visitor'
import { BlockStmt, type Stmt } from '../blocks/statements'
import { Statements } from '../blocks/statements/enum'
import { statementsClasses } from '../blocks/statements/records/classes'
import type { ExprId } from './exprs'
import type { StmtId } from './stmts'

export function buildStmt(
  id: StmtId,
  store?: TreeStore,
  visiting?: Set<string>,
): Stmt {
  if (visiting?.has(id))
    throw new Error('Statement has been visited previously')

  const st = store ?? useTreeStore.getState()

  const opt = st.stmts[id]
  const stmt = new statementsClasses[opt.name](id)
  const v = visiting ?? new Set()
  v.add(id)

  const visitorBuilderStmt: VisitorStmt = {
    visitStmt() {},
    visitBlockStmt(stmt) {
      if (opt.name !== Statements.Block) return
      stmt.children = opt.stmts.map((id) => buildStmt(id, st, v))
    },
    visitExprStmt(stmt) {
      if (opt.name !== Statements.Expr) return
      stmt.expression.set(buildExpr(opt.expr, st, v))
    },
    visitVariableStmt(stmt) {
      if (opt.name !== Statements.Variable) return
      stmt.identifier = opt.identifier
      stmt.expression.set(buildExpr(opt.expr, st, v))
    },
    visitPrintStmt(stmt) {
      if (opt.name !== Statements.Print) return
      stmt.expression.set(buildExpr(opt.expr, st, v))
    },
    visitIfStmt(stmt) {
      if (opt.name !== Statements.If) return
      stmt.condition.set(buildExpr(opt.condition, st, v))
      stmt.body = buildStmt(opt.body, st, v) as BlockStmt
    },
    visitElseIfStmt(stmt) {
      if (opt.name !== Statements.ElseIf) return
      stmt.condition.set(buildExpr(opt.condition, st, v))
      stmt.body = buildStmt(opt.body, st, v) as BlockStmt
    },
    visitElseStmt(stmt) {
      if (opt.name !== Statements.Else) return
      stmt.body = buildStmt(opt.body, st, v) as BlockStmt
    },
    visitWhileStmt(stmt) {
      if (opt.name !== Statements.While) return
      stmt.condition.set(buildExpr(opt.condition, st, v))
      stmt.body = buildStmt(opt.body, st, v) as BlockStmt
    },
    visitDoWhileStmt(stmt) {
      if (opt.name !== Statements.DoWhile) return
      stmt.condition.set(buildExpr(opt.condition, st, v))
      stmt.body = buildStmt(opt.body, st, v) as BlockStmt
    },
    visitForStmt(stmt) {
      if (opt.name !== Statements.For) return
      stmt.identifier = opt.identifier
      stmt.start.set(buildExpr(opt.start, st, v))
      stmt.step.set(buildExpr(opt.step, st, v))
      stmt.end.set(buildExpr(opt.end, st, v))
      stmt.body = buildStmt(opt.body, st, v) as BlockStmt
    },
    visitBreakStmt() {},
    visitContinueStmt() {},
    visitWaitStmt(stmt) {
      if (opt.name !== Statements.Wait) return
      stmt.duration.set(buildExpr(opt.duration, st, v))
    },
  }

  stmt.accept(visitorBuilderStmt)
  return stmt
}

export function buildExpr(
  id: ExprId,
  store?: TreeStore,
  visiting?: Set<string>,
): Expr | null {
  if (!id) return null
  if (visiting?.has(id))
    throw new Error('Expression has been visited previously')

  const st = store ?? useTreeStore.getState()

  const opt = st.exprs[id]
  if (opt == null) return null
  const expr = new expressionsClasses[opt.name](id)
  const v = visiting ?? new Set()
  v.add(id)

  const visitorBuilderExpr: VisitorExpr = {
    visitExpr() {},
    visitStringExpr(expr) {
      if (opt.name !== Expressions.StringLiteral) return
      expr.literal = opt.literal
    },
    visitNumberExpr(expr) {
      if (opt.name !== Expressions.NumberLiteral) return
      expr.literal = opt.literal
    },
    visitBooleanExpr(expr) {
      if (opt.name !== Expressions.BooleanLiteral) return
      expr.literal = opt.literal
    },
    visitNullExpr(expr) {
      if (opt.name !== Expressions.NullLiteral) return
      expr.literal = opt.literal
    },
    visitReadExpr(expr) {
      if (opt.name !== Expressions.Read) return
      expr.prompt.set(buildExpr(opt.prompt, st, v))
    },
    visitBinaryExpr(expr) {
      if (opt.name !== Expressions.Binary) return
      expr.operator = opt.operator
      expr.left.set(buildExpr(opt.left, st, v))
      expr.right.set(buildExpr(opt.right, st, v))
    },
    visitBinaryCompExpr(expr) {
      if (opt.name !== Expressions.BinaryComp) return
      expr.operator = opt.operator
      expr.left.set(buildExpr(opt.left, st, v))
      expr.right.set(buildExpr(opt.right, st, v))
    },
    visitLogicalExpr(expr) {
      if (opt.name !== Expressions.Logical) return
      expr.operator = opt.operator
      expr.left.set(buildExpr(opt.left, st, v))
      expr.right.set(buildExpr(opt.right, st, v))
    },
    visitVariableExpr(expr) {
      if (opt.name !== Expressions.Variable) return
      expr.type = opt.type
      expr.identifier = opt.identifier
    },
    visitAssignExpr(expr) {
      if (opt.name !== Expressions.Assign) return
      expr.type = opt.type
      expr.identifier = opt.identifier
      expr.expression.set(buildExpr(opt.expr, st, v))
    },
    visitAssignOpExpr(expr) {
      if (opt.name !== Expressions.AssignOp) return
      expr.type = opt.type
      expr.identifier = opt.identifier
      expr.operator = opt.operator
      expr.expression.set(buildExpr(opt.expr, st, v))
    },
    visitIncrementExpr(expr) {
      if (opt.name !== Expressions.Increment) return
      expr.type = opt.type
      expr.identifier = opt.identifier
      expr.operator = opt.operator
    },
    visitToStringExpr(expr) {
      if (opt.name !== Expressions.ToString) return
      expr.expression.set(buildExpr(opt.expr, st, v))
    },
    visitToNumberExpr(expr) {
      if (opt.name !== Expressions.ToNumber) return
      expr.expression.set(buildExpr(opt.expr, st, v))
    },
    visitToBooleanExpr(expr) {
      if (opt.name !== Expressions.ToBoolean) return
      expr.expression.set(buildExpr(opt.expr, st, v))
    },
    visitConcatExpr(expr) {
      if (opt.name !== Expressions.Concat) return
      expr.left.set(buildExpr(opt.left, st, v))
      expr.right.set(buildExpr(opt.right, st, v))
    },
  }

  expr.accept(visitorBuilderExpr)
  return expr
}

export function buildTree() {
  const store = useTreeStore.getState()
  const stmt = buildStmt(store.rootId)
  if (stmt instanceof BlockStmt) return stmt
  throw new Error('The root is not a Block Statement')
}
