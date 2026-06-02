import z from 'zod'
import { PrimaryType } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'

export enum IncrementOp {
  Increment = '++',
  Decrement = '--',
}

export class IncrementExpr extends Expr {
  static default = new IncrementExpr()
  name = Expressions.Increment

  identifier = ''
  operator: IncrementOp = IncrementOp.Increment
  type = PrimaryType.number

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  changeOperator(operator: IncrementOp) {
    this.operator = operator
  }

  copy(): IncrementExpr {
    const expr = new IncrementExpr(this.id)
    expr.identifier = this.identifier
    expr.operator = this.operator
    expr.type = this.type
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    identifier: z.string(),
    operator: z.nativeEnum(IncrementOp),
  })
  static createFrom(rawConfig: unknown): IncrementExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new IncrementExpr(data.id)
    expr.identifier = data.identifier
    expr.operator = data.operator
    return expr
  }
  export(): z.infer<typeof IncrementExpr.configSchema> {
    return {
      ...super.export(),
      identifier: this.identifier,
      operator: this.operator,
    }
  }
}
