import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'

export class ConcatExpr extends Expr {
  static default = new ConcatExpr()
  name = Expressions.Concat

  left = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La concatenación requiere texto en ambos lados, recibió ${expr.type} a la izquierda`,
        }

      return null
    },
    'No se ha establecido un texto a la izquierda',
  )
  right = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La concatenación requiere texto en ambos lados, recibió ${expr.type} a la derecha`,
        }

      return null
    },
    'No se ha establecido un texto a la derecha',
  )

  type = PrimaryType.string

  copy(): ConcatExpr {
    const expr = new ConcatExpr(this.id)
    expr.left = this.left.copy()
    expr.right = this.right.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    left: z.unknown(),
    right: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ConcatExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new ConcatExpr(data.id)
    expr.left._expr = Expr.createFrom(data.left)
    expr.right._expr = Expr.createFrom(data.right)
    return expr
  }
  export(): z.infer<typeof ConcatExpr.configSchema> {
    return {
      ...super.export(),
      left: this.left._expr?.export() ?? null,
      right: this.right._expr?.export() ?? null,
    }
  }
}
