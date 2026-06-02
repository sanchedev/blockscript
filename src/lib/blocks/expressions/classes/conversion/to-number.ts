import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'

export class ToNumberExpr extends Expr {
  static default = new ToNumberExpr()
  name = Expressions.ToNumber

  expression = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La conversión requiere texto, recibió ${expr.type}`,
        }

      return null
    },
    'No se ha establecido un texto para la conversión',
  )

  type = PrimaryType.number

  copy(): ToNumberExpr {
    const expr = new ToNumberExpr(this.id)
    expr.expression = this.expression.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    expression: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ToNumberExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new ToNumberExpr(data.id)
    expr.expression._expr = Expr.createFrom(data.expression)
    return expr
  }
  export(): z.infer<typeof ToNumberExpr.configSchema> {
    return {
      ...super.export(),
      expression: this.expression._expr?.export() ?? null,
    }
  }
}
