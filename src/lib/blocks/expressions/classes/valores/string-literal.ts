import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'

export class StringLiteralExpr extends Expr {
  static default = new StringLiteralExpr()
  name = Expressions.StringLiteral

  literal = ''

  type = PrimaryType.string

  edit(literal: string) {
    this.literal = literal
  }
  copy(): StringLiteralExpr {
    const expr = new StringLiteralExpr(this.id)
    expr.literal = this.literal
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    literal: z.string(),
  })
  static createFrom(rawConfig: unknown): StringLiteralExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new StringLiteralExpr(data.id)
    expr.literal = data.literal
    return expr
  }
  export(): z.infer<typeof StringLiteralExpr.configSchema> {
    return {
      ...super.export(),
      literal: this.literal,
    }
  }
}
