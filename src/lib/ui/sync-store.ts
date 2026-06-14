import type { Expr } from '../blocks/expressions'
import {
  NumberLiteralExpr,
  StringLiteralExpr,
  BooleanLiteralExpr,
  NullLiteralExpr,
  BinaryExpr,
  BinaryCompExpr,
  LogicalExpr,
  VariableExpr,
  AssignExpr,
  AssignOpExpr,
  IncrementExpr,
  ReadExpr,
  ConcatExpr,
  ToStringExpr,
  ToNumberExpr,
  ToBooleanExpr,
} from '../blocks/expressions'
import type { Stmt } from '../blocks/statements'
import {
  BlockStmt,
  ExprStmt,
  PrintStmt,
  VariableStmt,
  IfStmt,
  ElseIfStmt,
  ElseStmt,
  WhileStmt,
  DoWhileStmt,
  ForStmt,
  WaitStmt,
  BreakStmt,
  ContinueStmt,
} from '../blocks/statements'
import type { ExprId, ExprOptions } from './exprs'
import type { StmtId, StmtOptions } from './stmts'
import { useTreeStore } from '../../stores/tree-store'
import { Expressions } from '../blocks/expressions/enum'
import { Statements } from '../blocks/statements/enum'

function toEid(expr: Expr | null): ExprId {
  return `expr=${expr?.id}` as ExprId
}

function toSid(stmt: Stmt | null): StmtId {
  return `stmt=${stmt?.id}` as StmtId
}

function exprToOptions(expr: Expr): ExprOptions {
  const id = toEid(expr)

  if (expr instanceof NumberLiteralExpr) {
    return { id, name: Expressions.NumberLiteral, type: expr.type, literal: expr.literal } as ExprOptions
  }
  if (expr instanceof StringLiteralExpr) {
    return { id, name: Expressions.StringLiteral, type: expr.type, literal: expr.literal } as ExprOptions
  }
  if (expr instanceof BooleanLiteralExpr) {
    return { id, name: Expressions.BooleanLiteral, type: expr.type, literal: expr.literal } as ExprOptions
  }
  if (expr instanceof NullLiteralExpr) {
    return { id, name: Expressions.NullLiteral, type: expr.type, literal: null } as ExprOptions
  }
  if (expr instanceof ReadExpr) {
    return { id, name: Expressions.Read, type: expr.type, prompt: toEid(expr.prompt._expr) } as ExprOptions
  }
  if (expr instanceof BinaryExpr) {
    return {
      id, name: Expressions.Binary, type: expr.type,
      left: toEid(expr.left._expr), operator: expr.operator, right: toEid(expr.right._expr),
    } as ExprOptions
  }
  if (expr instanceof BinaryCompExpr) {
    return {
      id, name: Expressions.BinaryComp, type: expr.type,
      left: toEid(expr.left._expr), operator: expr.operator, right: toEid(expr.right._expr),
    } as ExprOptions
  }
  if (expr instanceof LogicalExpr) {
    return {
      id, name: Expressions.Logical, type: expr.type,
      left: toEid(expr.left._expr), operator: expr.operator, right: toEid(expr.right._expr),
    } as ExprOptions
  }
  if (expr instanceof ConcatExpr) {
    return {
      id, name: Expressions.Concat, type: expr.type,
      left: toEid(expr.left._expr), right: toEid(expr.right._expr),
    } as ExprOptions
  }
  if (expr instanceof ToStringExpr) {
    return { id, name: Expressions.ToString, type: expr.type, expr: toEid(expr.expression._expr) } as ExprOptions
  }
  if (expr instanceof ToNumberExpr) {
    return { id, name: Expressions.ToNumber, type: expr.type, expr: toEid(expr.expression._expr) } as ExprOptions
  }
  if (expr instanceof ToBooleanExpr) {
    return { id, name: Expressions.ToBoolean, type: expr.type, expr: toEid(expr.expression._expr) } as ExprOptions
  }
  if (expr instanceof VariableExpr) {
    return { id, name: Expressions.Variable, type: expr.type, identifier: expr.identifier } as ExprOptions
  }
  if (expr instanceof AssignExpr) {
    return {
      id, name: Expressions.Assign, type: expr.type,
      identifier: expr.identifier, expr: toEid(expr.expression._expr),
    } as ExprOptions
  }
  if (expr instanceof AssignOpExpr) {
    return {
      id, name: Expressions.AssignOp, type: expr.type,
      identifier: expr.identifier, operator: expr.operator, expr: toEid(expr.expression._expr),
    } as ExprOptions
  }
  if (expr instanceof IncrementExpr) {
    return { id, name: Expressions.Increment, type: expr.type, identifier: expr.identifier, operator: expr.operator } as ExprOptions
  }

  return { id, name: Expressions.Expression, type: expr.type } as ExprOptions
}

function stmtToOptions(stmt: Stmt): StmtOptions {
  const id = toSid(stmt)

  if (stmt instanceof BlockStmt) {
    return { id, name: Statements.Block, stmts: stmt.children.map(toSid) } as StmtOptions
  }
  if (stmt instanceof ExprStmt) {
    return { id, name: Statements.Expr, expr: toEid(stmt.expression._expr) } as StmtOptions
  }
  if (stmt instanceof PrintStmt) {
    return { id, name: Statements.Print, expr: toEid(stmt.expression._expr) } as StmtOptions
  }
  if (stmt instanceof VariableStmt) {
    return { id, name: Statements.Variable, identifier: stmt.identifier, expr: toEid(stmt.expression._expr) } as StmtOptions
  }
  if (stmt instanceof IfStmt) {
    return { id, name: Statements.If, condition: toEid(stmt.condition._expr), body: toSid(stmt.body) } as StmtOptions
  }
  if (stmt instanceof ElseIfStmt) {
    return { id, name: Statements.ElseIf, condition: toEid(stmt.condition._expr), body: toSid(stmt.body) } as StmtOptions
  }
  if (stmt instanceof ElseStmt) {
    return { id, name: Statements.Else, body: toSid(stmt.body) } as StmtOptions
  }
  if (stmt instanceof WhileStmt) {
    return { id, name: Statements.While, condition: toEid(stmt.condition._expr), body: toSid(stmt.body) } as StmtOptions
  }
  if (stmt instanceof DoWhileStmt) {
    return { id, name: Statements.DoWhile, condition: toEid(stmt.condition._expr), body: toSid(stmt.body) } as StmtOptions
  }
  if (stmt instanceof ForStmt) {
    return {
      id, name: Statements.For, identifier: stmt.identifier,
      start: toEid(stmt.start._expr), end: toEid(stmt.end._expr),
      step: toEid(stmt.step._expr), body: toSid(stmt.body),
    } as StmtOptions
  }
  if (stmt instanceof WaitStmt) {
    return { id, name: Statements.Wait, duration: toEid(stmt.duration._expr) } as StmtOptions
  }
  if (stmt instanceof BreakStmt) {
    return { id, name: Statements.Break } as StmtOptions
  }
  if (stmt instanceof ContinueStmt) {
    return { id, name: Statements.Continue } as StmtOptions
  }

  return { id, name: Statements.Stmt } as StmtOptions
}

export function syncExpr(expr: Expr) {
  const store = useTreeStore.getState()
  const id = toEid(expr)
  if (store.exprs[id] != null) return
  store.setExpr(id, exprToOptions(expr))
}

export function syncStmt(stmt: Stmt) {
  const store = useTreeStore.getState()
  const id = toSid(stmt)
  if (store.stmts[id] != null) return

  if (stmt instanceof BlockStmt) {
    stmt.children.forEach(syncStmt)
  }
  store.setStmt(id, stmtToOptions(stmt))
}

export function syncExprTree(expr: Expr) {
  const store = useTreeStore.getState()
  const id = toEid(expr)
  if (store.exprs[id] != null) return

  if (expr instanceof BinaryExpr) {
    if (expr.left._expr) syncExprTree(expr.left._expr)
    if (expr.right._expr) syncExprTree(expr.right._expr)
  } else if (expr instanceof BinaryCompExpr) {
    if (expr.left._expr) syncExprTree(expr.left._expr)
    if (expr.right._expr) syncExprTree(expr.right._expr)
  } else if (expr instanceof LogicalExpr) {
    if (expr.left._expr) syncExprTree(expr.left._expr)
    if (expr.right._expr) syncExprTree(expr.right._expr)
  } else if (expr instanceof ConcatExpr) {
    if (expr.left._expr) syncExprTree(expr.left._expr)
    if (expr.right._expr) syncExprTree(expr.right._expr)
  } else if (expr instanceof ToStringExpr) {
    if (expr.expression._expr) syncExprTree(expr.expression._expr)
  } else if (expr instanceof ToNumberExpr) {
    if (expr.expression._expr) syncExprTree(expr.expression._expr)
  } else if (expr instanceof ToBooleanExpr) {
    if (expr.expression._expr) syncExprTree(expr.expression._expr)
  } else if (expr instanceof ReadExpr) {
    if (expr.prompt._expr) syncExprTree(expr.prompt._expr)
  } else if (expr instanceof AssignExpr) {
    if (expr.expression._expr) syncExprTree(expr.expression._expr)
  } else if (expr instanceof AssignOpExpr) {
    if (expr.expression._expr) syncExprTree(expr.expression._expr)
  }

  store.setExpr(id, exprToOptions(expr))
}

export function syncStmtTree(stmt: Stmt) {
  const store = useTreeStore.getState()
  const id = toSid(stmt)
  if (store.stmts[id] != null) return

  if (stmt instanceof BlockStmt) {
    stmt.children.forEach(syncStmtTree)
  }
  if (stmt instanceof ExprStmt) {
    if (stmt.expression._expr) syncExprTree(stmt.expression._expr)
  }
  if (stmt instanceof PrintStmt) {
    if (stmt.expression._expr) syncExprTree(stmt.expression._expr)
  }
  if (stmt instanceof VariableStmt) {
    if (stmt.expression._expr) syncExprTree(stmt.expression._expr)
  }
  if (stmt instanceof IfStmt) {
    if (stmt.condition._expr) syncExprTree(stmt.condition._expr)
    syncStmtTree(stmt.body)
  }
  if (stmt instanceof ElseIfStmt) {
    if (stmt.condition._expr) syncExprTree(stmt.condition._expr)
    syncStmtTree(stmt.body)
  }
  if (stmt instanceof ElseStmt) {
    syncStmtTree(stmt.body)
  }
  if (stmt instanceof WhileStmt) {
    if (stmt.condition._expr) syncExprTree(stmt.condition._expr)
    syncStmtTree(stmt.body)
  }
  if (stmt instanceof DoWhileStmt) {
    if (stmt.condition._expr) syncExprTree(stmt.condition._expr)
    syncStmtTree(stmt.body)
  }
  if (stmt instanceof ForStmt) {
    if (stmt.start._expr) syncExprTree(stmt.start._expr)
    if (stmt.end._expr) syncExprTree(stmt.end._expr)
    if (stmt.step._expr) syncExprTree(stmt.step._expr)
    syncStmtTree(stmt.body)
  }
  if (stmt instanceof WaitStmt) {
    if (stmt.duration._expr) syncExprTree(stmt.duration._expr)
  }

  store.setStmt(id, stmtToOptions(stmt))
}
