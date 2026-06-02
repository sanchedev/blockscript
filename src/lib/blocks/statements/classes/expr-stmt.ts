import z from 'zod'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'

export class ExprStmt extends Stmt {
  static default = new ExprStmt()
  name = Statements.Expr

  expression = new ExprContainer(this)

  copy(): ExprStmt {
    const expr = new ExprStmt(this.id)
    expr.expression = this.expression.copy()
    return expr
  }
  static configSchema = Stmt.configSchema.extend({
    expression: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ExprStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const exprStmt = new ExprStmt(data.id)
    exprStmt.expression._expr = Expr.createFrom(data.expression)
    return exprStmt
  }
  export(): z.infer<typeof ExprStmt.configSchema> {
    return {
      ...super.export(),
      expression: this.expression._expr?.export() ?? null,
    }
  }
}
