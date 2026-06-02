import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'

export class NumberLiteralExpr extends Expr {
  static default = new NumberLiteralExpr()
  name = Expressions.NumberLiteral

  literal = 0

  type = PrimaryType.number

  edit(literal: number) {
    this.literal = literal
  }
  copy(): NumberLiteralExpr {
    const expr = new NumberLiteralExpr(this.id)
    expr.literal = this.literal
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    literal: z.number(),
  })
  static createFrom(rawConfig: unknown): NumberLiteralExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new NumberLiteralExpr(data.id)
    expr.literal = data.literal
    return expr
  }
  export(): z.infer<typeof NumberLiteralExpr.configSchema> {
    return {
      ...super.export(),
      literal: this.literal,
    }
  }
}
