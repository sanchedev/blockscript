import type { Expr } from '../../expressions'
import { NumberLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'
import { WhileStmt } from './while-stmt'

export class ForStmt extends Stmt {
  name = Statements.For

  identifier = ''
  start: Expr = new NumberLiteralExpr()
  end: Expr = new NumberLiteralExpr()
  step: Expr = Object.assign(new NumberLiteralExpr(), { literal: 1 })
  body: BlockStmt = new BlockStmt()

  edit(identifier: string, start: Expr, end: Expr, step: Expr) {
    this.identifier = identifier
    this.start = start
    this.end = end
    this.step = step
  }

  copy(): ForStmt {
    const stmt = new ForStmt(this.id)
    stmt.identifier = this.identifier
    stmt.start = this.start.copy()
    stmt.end = this.end.copy()
    stmt.step = this.step.copy()
    stmt.body = this.body.copy() as BlockStmt
    return stmt
  }

  migrateFrom(source: Stmt) {
    if (source instanceof ForStmt) {
      this.identifier = source.identifier
      this.start = source.start.copy()
      this.end = source.end.copy()
      this.step = source.step.copy()
      this.body = source.body.copy() as BlockStmt
    } else if (source instanceof WhileStmt) {
      this.body = source.body.copy() as BlockStmt
    } else if (source instanceof BlockStmt) {
      this.body = source.copy() as BlockStmt
    } else {
      this.identifier = ''
      this.start = new NumberLiteralExpr()
      this.end = new NumberLiteralExpr()
      this.step = new NumberLiteralExpr()
      this.body = new BlockStmt()
    }
  }
}
