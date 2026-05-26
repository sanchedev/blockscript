import type { Expr } from '../../expressions'
import { BooleanLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class IfStmt extends Stmt {
  name = Statements.If

  condition: Expr = new BooleanLiteralExpr()
  thenBody: BlockStmt = new BlockStmt()

  edit(condition: Expr, thenBody: BlockStmt) {
    this.condition = condition
    this.thenBody = thenBody
  }

  copy(): IfStmt {
    const stmt = new IfStmt(this.id)
    stmt.condition = this.condition.copy()
    stmt.thenBody = this.thenBody.copy() as BlockStmt
    return stmt
  }

  migrateFrom(source: Stmt) {
    if (source instanceof IfStmt) {
      this.condition = source.condition.copy()
      this.thenBody = source.thenBody.copy() as BlockStmt
    } else if (source instanceof BlockStmt) {
      this.thenBody = source.copy() as BlockStmt
    } else {
      this.condition = new BooleanLiteralExpr()
      this.thenBody = new BlockStmt()
    }
  }
}
