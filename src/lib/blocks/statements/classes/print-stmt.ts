import z from 'zod'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'

export class PrintStmt extends Stmt {
  static default = new PrintStmt()
  name = Statements.Print

  expression = new ExprContainer(this)

  copy(): PrintStmt {
    const stmt = new PrintStmt(this.id)
    stmt.expression = this.expression.copy()
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    expression: z.unknown(),
  })
  static createFrom(rawConfig: unknown): PrintStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const printStmt = new PrintStmt(data.id)
    printStmt.expression._expr = Expr.createFrom(data.expression)
    return printStmt
  }
  export(): z.infer<typeof PrintStmt.configSchema> {
    return {
      ...super.export(),
      expression: this.expression._expr?.export() ?? null,
    }
  }
}
