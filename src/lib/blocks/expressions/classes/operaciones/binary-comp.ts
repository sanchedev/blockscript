import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'

export enum BinaryCompOp {
  Gt = '>',
  Lt = '<',
  Gte = '>=',
  Lte = '<=',
  Eq = '==',
  Neq = '!=',
}

export class BinaryCompExpr extends Expr {
  static default = new BinaryCompExpr()
  name = Expressions.BinaryComp

  left: ExprContainer
  operator: BinaryCompOp = BinaryCompOp.Gt
  right: ExprContainer

  constructor(id?: string) {
    super(id)
    this.left = new ExprContainer(
      this,
      (expr) => {
        if (
          expr.type !== PrimaryType.number &&
          this.operator !== BinaryCompOp.Eq &&
          this.operator !== BinaryCompOp.Neq
        )
          return {
            type: ErrorType.Type,
            message: `La comparación requiere número en ambos lados, recibió ${expr.type} a la izquierda`,
          }
        const type = this.right.get()?.type ?? PrimaryType.null
        if (expr.type !== type)
          return {
            type: ErrorType.Type,
            message: `La comparación requiere el mismo tipo que la derecha ${type} en ambos lados, recibió ${expr.type} a la izquierda`,
          }

        return null
      },
      'No se ha establecido un número a la izquierda',
    )
    this.right = new ExprContainer(
      this,
      (expr) => {
        if (
          expr.type !== PrimaryType.number &&
          this.operator !== BinaryCompOp.Eq &&
          this.operator !== BinaryCompOp.Neq
        )
          return {
            type: ErrorType.Type,
            message: `La comparación requiere número en ambos lados, recibió ${expr.type} a la derecha`,
          }
        const type = this.left.get()?.type ?? PrimaryType.null
        if (expr.type !== type)
          return {
            type: ErrorType.Type,
            message: `La comparación requiere el mismo tipo que la izquierda ${type} en ambos lados, recibió ${expr.type} a la derecha`,
          }

        return null
      },
      'No se ha establecido un número a la derecha',
    )
  }

  type = PrimaryType.boolean

  changeOperator(operator: BinaryCompOp) {
    this.operator = operator
  }

  copy(): BinaryCompExpr {
    const expr = new BinaryCompExpr(this.id)
    expr.left = this.left.copy()
    expr.operator = this.operator
    expr.right = this.right.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    left: z.unknown(),
    operator: z.nativeEnum(BinaryCompOp),
    right: z.unknown(),
  })
  static createFrom(rawConfig: unknown): BinaryCompExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new BinaryCompExpr(data.id)
    expr.left._expr = Expr.createFrom(data.left)
    expr.operator = data.operator
    expr.right._expr = Expr.createFrom(data.right)
    return expr
  }
  export(): z.infer<typeof BinaryCompExpr.configSchema> {
    return {
      ...super.export(),
      left: this.left._expr?.export() ?? null,
      operator: this.operator,
      right: this.right._expr?.export() ?? null,
    }
  }
}
