import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'

export enum LogicalOp {
  And = 'Y',
  Or = 'O',
}

export class LogicalExpr extends Expr {
  static default = new LogicalExpr()
  name = Expressions.Logical

  left = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.boolean)
        return {
          type: ErrorType.Type,
          message: `La operación lógica requiere V / F en ambos lados, recibió ${expr.type} a la izquierda`,
        }

      return null
    },
    'No se ha establecido un V / F a la izquierda',
  )
  operator: LogicalOp = LogicalOp.And
  right = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.boolean)
        return {
          type: ErrorType.Type,
          message: `La operación lógica requiere V / F en ambos lados, recibió ${expr.type} a la derecha`,
        }

      return null
    },
    'No se ha establecido un V / F a la derecha',
  )

  type = PrimaryType.boolean

  changeOperator(operator: LogicalOp) {
    this.operator = operator
  }
  copy(): LogicalExpr {
    const expr = new LogicalExpr(this.id)
    expr.left = this.left.copy()
    expr.operator = this.operator
    expr.right = this.right.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    left: z.unknown(),
    operator: z.nativeEnum(LogicalOp),
    right: z.unknown(),
  })
  static createFrom(rawConfig: unknown): LogicalExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new LogicalExpr(data.id)
    expr.left._expr = Expr.createFrom(data.left)
    expr.operator = data.operator
    expr.right._expr = Expr.createFrom(data.right)
    return expr
  }
  export(): z.infer<typeof LogicalExpr.configSchema> {
    return {
      ...super.export(),
      left: this.left._expr?.export() ?? null,
      operator: this.operator,
      right: this.right._expr?.export() ?? null,
    }
  }
}
