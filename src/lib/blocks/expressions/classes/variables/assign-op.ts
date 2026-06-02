import z from 'zod'
import { ErrorType } from '../../../../errors'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Expressions } from '../../enum'
import { Expr } from '../expr'

export enum AssignOp {
  AddAssign = '+=',
  SubAssign = '-=',
  MulAssign = '*=',
  DivAssign = '/=',
  ModAssign = '%=',
}

export class AssignOpExpr extends Expr {
  static default = new AssignOpExpr()
  name = Expressions.AssignOp

  identifier = ''
  operator: AssignOp = AssignOp.AddAssign
  expression = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `La asignación requiere número, recibió ${expr.type}`,
        }
      return null
    },
    'No se ha establecido un valor a la asignación',
  )
  type = PrimaryType.number

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  changeOperator(operator: AssignOp) {
    this.operator = operator
  }
  copy(): AssignOpExpr {
    const expr = new AssignOpExpr(this.id)
    expr.identifier = this.identifier
    expr.operator = this.operator
    expr.expression = this.expression.copy()
    expr.type = this.type
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    identifier: z.string(),
    operator: z.nativeEnum(AssignOp),
    expression: z.unknown(),
  })
  static createFrom(rawConfig: unknown): AssignOpExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new AssignOpExpr(data.id)
    expr.identifier = data.identifier
    expr.operator = data.operator
    expr.expression._expr = Expr.createFrom(data.expression)
    return expr
  }
  export(): z.infer<typeof AssignOpExpr.configSchema> {
    return {
      ...super.export(),
      identifier: this.identifier,
      operator: this.operator,
      expression: this.expression._expr?.export() ?? null,
    }
  }
}
