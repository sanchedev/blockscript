import z from 'zod'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'

export class VariableStmt extends Stmt {
  static default = new VariableStmt()
  name = Statements.Variable

  identifier = ''
  expression = new ExprContainer(
    this,
    () => null,
    'No se ha establecido una valor a esta variable',
  )

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  copy(): VariableStmt {
    const stmt = new VariableStmt(this.id)
    stmt.identifier = this.identifier
    stmt.expression = this.expression.copy()
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    identifier: z.string(),
    expression: z.unknown(),
  })
  static createFrom(rawConfig: unknown): VariableStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const varStmt = new VariableStmt(data.id)
    varStmt.identifier = data.identifier
    varStmt.expression._expr = Expr.createFrom(data.expression)
    return varStmt
  }
  export(): z.infer<typeof VariableStmt.configSchema> {
    return {
      ...super.export(),
      identifier: this.identifier,
      expression: this.expression._expr?.export() ?? null,
    }
  }
}
