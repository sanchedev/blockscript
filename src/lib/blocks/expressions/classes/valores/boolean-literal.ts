import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'

export class BooleanLiteralExpr extends Expr {
  static default = new BooleanLiteralExpr()
  name = Expressions.BooleanLiteral

  literal = false

  type = PrimaryType.boolean

  edit(literal: boolean) {
    this.literal = literal
  }
  copy(): BooleanLiteralExpr {
    const expr = new BooleanLiteralExpr(this.id)
    expr.literal = this.literal
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    literal: z.boolean(),
  })
  static createFrom(rawConfig: unknown): BooleanLiteralExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new BooleanLiteralExpr(data.id)
    expr.literal = data.literal
    return expr
  }
  export(): z.infer<typeof BooleanLiteralExpr.configSchema> {
    return {
      ...super.export(),
      literal: this.literal,
    }
  }
}
