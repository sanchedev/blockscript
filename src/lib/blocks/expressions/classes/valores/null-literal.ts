import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'

export class NullLiteralExpr extends Expr {
  static default = new NullLiteralExpr()
  name = Expressions.NullLiteral

  literal = null

  copy(): NullLiteralExpr {
    const expr = new NullLiteralExpr(this.id)
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    literal: z.null(),
  })
  static createFrom(rawConfig: unknown): NullLiteralExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    return new NullLiteralExpr(data.id)
  }
  export(): z.infer<typeof NullLiteralExpr.configSchema> {
    return {
      ...super.export(),
      literal: this.literal,
    }
  }
}
