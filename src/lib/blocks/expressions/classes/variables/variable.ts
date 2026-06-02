import z from 'zod'
import { PrimaryType, type Type } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'

export class VariableExpr extends Expr {
  static default = new VariableExpr()
  name = Expressions.Variable

  identifier = ''

  type: Type = PrimaryType.null

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  changeType(type: Type) {
    this.type = type
  }
  copy(): VariableExpr {
    const expr = new VariableExpr(this.id)
    expr.identifier = this.identifier
    expr.type = this.type
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    identifier: z.string(),
    type: z.nativeEnum(PrimaryType),
  })
  static createFrom(rawConfig: unknown): VariableExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new VariableExpr(data.id)
    expr.identifier = data.identifier
    expr.type = data.type
    return expr
  }
  export(): z.infer<typeof VariableExpr.configSchema> {
    return {
      ...super.export(),
      identifier: this.identifier,
      type: this.type,
    }
  }
}
