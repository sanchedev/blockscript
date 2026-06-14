import type {
  Expr,
  ReadExpr,
  BinaryExpr,
  BinaryCompExpr,
  LogicalExpr,
  VariableExpr,
  AssignExpr,
  AssignOpExpr,
  IncrementExpr,
  ToStringExpr,
  ToNumberExpr,
  ToBooleanExpr,
  ConcatExpr,
  BooleanLiteralExpr,
  NullLiteralExpr,
  NumberLiteralExpr,
  StringLiteralExpr,
} from '../expressions'
import type {
  Stmt,
  BlockStmt,
  ExprStmt,
  VariableStmt,
  PrintStmt,
  IfStmt,
  ElseIfStmt,
  ElseStmt,
  WhileStmt,
  DoWhileStmt,
  ForStmt,
  BreakStmt,
  ContinueStmt,
  WaitStmt,
} from '../statements'

export interface VisitorStmt {
  visitStmt(stmt: Stmt): void
  visitBlockStmt(stmt: BlockStmt): void
  visitExprStmt(stmt: ExprStmt): void
  visitVariableStmt(stmt: VariableStmt): void
  visitPrintStmt(stmt: PrintStmt): void
  visitIfStmt(stmt: IfStmt): void
  visitElseIfStmt(stmt: ElseIfStmt): void
  visitElseStmt(stmt: ElseStmt): void
  visitWhileStmt(stmt: WhileStmt): void
  visitDoWhileStmt(stmt: DoWhileStmt): void
  visitForStmt(stmt: ForStmt): void
  visitBreakStmt(stmt: BreakStmt): void
  visitContinueStmt(stmt: ContinueStmt): void
  visitWaitStmt(stmt: WaitStmt): void
}

export interface VisitorExpr {
  visitExpr(expr: Expr): void
  visitStringExpr(expr: StringLiteralExpr): void
  visitNumberExpr(expr: NumberLiteralExpr): void
  visitBooleanExpr(expr: BooleanLiteralExpr): void
  visitNullExpr(expr: NullLiteralExpr): void
  visitReadExpr(expr: ReadExpr): void
  visitBinaryExpr(expr: BinaryExpr): void
  visitBinaryCompExpr(expr: BinaryCompExpr): void
  visitLogicalExpr(expr: LogicalExpr): void
  visitVariableExpr(expr: VariableExpr): void
  visitAssignExpr(expr: AssignExpr): void
  visitAssignOpExpr(expr: AssignOpExpr): void
  visitIncrementExpr(expr: IncrementExpr): void
  visitToStringExpr(expr: ToStringExpr): void
  visitToNumberExpr(expr: ToNumberExpr): void
  visitToBooleanExpr(expr: ToBooleanExpr): void
  visitConcatExpr(expr: ConcatExpr): void
}
