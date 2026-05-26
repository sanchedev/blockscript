import type { Expr } from '../../expressions'
import { BooleanLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'
import { WhileStmt } from './while-stmt'

export class DoWhileStmt extends Stmt {
  name = Statements.DoWhile

  body: BlockStmt = new BlockStmt()
  condition: Expr = new BooleanLiteralExpr()

  edit(body: BlockStmt, condition: Expr) {
    this.body = body
    this.condition = condition
  }

  copy(): DoWhileStmt {
    const stmt = new DoWhileStmt(this.id)
    stmt.body = this.body.copy() as BlockStmt
    stmt.condition = this.condition.copy()
    return stmt
  }

  migrateFrom(source: Stmt) {
    if (source instanceof DoWhileStmt) {
      this.body = source.body.copy() as BlockStmt
      this.condition = source.condition.copy()
    } else if (source instanceof WhileStmt) {
      this.body = source.body.copy() as BlockStmt
      this.condition = source.condition.copy()
    } else if (source instanceof BlockStmt) {
      this.body = source.copy() as BlockStmt
    } else {
      this.body = new BlockStmt()
      this.condition = new BooleanLiteralExpr()
    }
  }
}
