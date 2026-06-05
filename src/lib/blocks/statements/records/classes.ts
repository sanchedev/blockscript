import { Statements } from '../enum'
import {
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
  Stmt,
} from '../classes'
import { BlockStmt } from '../classes/block-stmt'

export const statementsClasses = {
  [Statements.Stmt]: Stmt,
  [Statements.Expr]: ExprStmt,
  [Statements.Print]: PrintStmt,
  [Statements.Variable]: VariableStmt,
  [Statements.Block]: BlockStmt,
  [Statements.If]: IfStmt,
  [Statements.ElseIf]: ElseIfStmt,
  [Statements.Else]: ElseStmt,
  [Statements.While]: WhileStmt,
  [Statements.DoWhile]: DoWhileStmt,
  [Statements.For]: ForStmt,
  [Statements.Wait]: WaitStmt,
}
