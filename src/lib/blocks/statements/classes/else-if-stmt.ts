import type { Expr } from '../../expressions'
import { BooleanLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class ElseIfStmt extends Stmt {
  name = Statements.ElseIf

  condition: Expr = new BooleanLiteralExpr()
  body: BlockStmt = new BlockStmt()

  edit(condition: Expr, thenBody: BlockStmt) {
    this.condition = condition
    this.body = thenBody
  }

  copy(): ElseIfStmt {
    const stmt = new ElseIfStmt(this.id)
    stmt.condition = this.condition.copy()
    stmt.body = this.body.copy() as BlockStmt
    return stmt
  }

  migrateFrom(source: Stmt) {
    if (source instanceof ElseIfStmt) {
      this.condition = source.condition.copy()
      this.body = source.body.copy() as BlockStmt
    } else if (source instanceof BlockStmt) {
      this.body = source.copy() as BlockStmt
    } else {
      this.condition = new BooleanLiteralExpr()
      this.body = new BlockStmt()
    }
  }
}
