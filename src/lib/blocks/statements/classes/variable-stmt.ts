import type { Expr } from '../../expressions'
import { NullLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'

export class VariableStmt extends Stmt {
  name = Statements.Variable

  identifier = ''
  expression: Expr = new NullLiteralExpr()

  edit(identifier: string, expression: Expr) {
    this.identifier = identifier
    this.expression = expression
  }
  copy(): VariableStmt {
    const stmt = new VariableStmt(this.id)
    stmt.identifier = this.identifier
    stmt.expression = this.expression.copy()
    return stmt
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  migrateFrom(_source: Stmt) {
    this.identifier = ''
    this.expression = new NullLiteralExpr()
  }
}
