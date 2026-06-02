import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'

export class ToStringExpr extends Expr {
  static default = new ToStringExpr()
  name = Expressions.ToString

  expression = new ExprContainer(
    this,
    () => null,
    'No se ha establecido un dato para la conversión',
  )

  type = PrimaryType.string

  copy(): ToStringExpr {
    const expr = new ToStringExpr(this.id)
    expr.expression = this.expression.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    expression: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ToStringExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new ToStringExpr(data.id)
    expr.expression._expr = Expr.createFrom(data.expression)
    return expr
  }
  export(): z.infer<typeof ToStringExpr.configSchema> {
    return {
      ...super.export(),
      expression: this.expression._expr?.export() ?? null,
    }
  }
}
