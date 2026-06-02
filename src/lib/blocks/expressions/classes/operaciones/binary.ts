import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'

export enum BinaryOp {
  Add = '+',
  Sub = '-',
  Mul = '*',
  Div = '/',
  Mod = '%',
}

export class BinaryExpr extends Expr {
  static default = new BinaryExpr()
  name = Expressions.Binary

  left = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `La operación aritmética requiere número en ambos lados, recibió ${expr.type} a la izquierda`,
        }

      return null
    },
    'No se ha establecido un número a la izquierda',
  )
  operator: BinaryOp = BinaryOp.Add
  right = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `La operación aritmética requiere número en ambos lados, recibió ${expr.type} a la derecha`,
        }

      return null
    },
    'No se ha establecido un número a la derecha',
  )

  type = PrimaryType.number

  changeOperator(operator: BinaryOp) {
    this.operator = operator
  }
  copy(): BinaryExpr {
    const expr = new BinaryExpr(this.id)
    expr.left = this.left.copy()
    expr.operator = this.operator
    expr.right = this.right.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    left: z.unknown(),
    operator: z.nativeEnum(BinaryOp),
    right: z.unknown(),
  })
  static createFrom(rawConfig: unknown): BinaryExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new BinaryExpr(data.id)
    expr.left._expr = Expr.createFrom(data.left)
    expr.operator = data.operator
    expr.right._expr = Expr.createFrom(data.right)
    return expr
  }
  export(): z.infer<typeof BinaryExpr.configSchema> {
    return {
      ...super.export(),
      left: this.left._expr?.export() ?? null,
      operator: this.operator,
      right: this.right._expr?.export() ?? null,
    }
  }
}
