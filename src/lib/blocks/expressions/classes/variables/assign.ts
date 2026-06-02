import z from 'zod'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Expressions } from '../../enum'
import { Expr } from '../expr'

export class AssignExpr extends Expr {
  static default = new AssignExpr()
  name = Expressions.Assign

  identifier = ''
  expression = new ExprContainer(
    this,
    () => null,
    'No se ha establecido un valor a la asignación',
  )
  type = PrimaryType.null

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  copy(): AssignExpr {
    const expr = new AssignExpr(this.id)
    expr.identifier = this.identifier
    expr.expression = this.expression.copy()
    expr.type = this.type
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    identifier: z.string(),
    expression: z.unknown(),
    type: z.nativeEnum(PrimaryType),
  })
  static createFrom(rawConfig: unknown): AssignExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new AssignExpr(data.id)
    expr.identifier = data.identifier
    expr.expression._expr = Expr.createFrom(data.expression)
    expr.type = data.type
    return expr
  }
  export(): z.infer<typeof AssignExpr.configSchema> {
    return {
      ...super.export(),
      identifier: this.identifier,
      expression: this.expression._expr?.export() ?? null,
      type: this.type,
    }
  }
}
