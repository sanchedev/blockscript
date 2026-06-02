import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'

export class ReadExpr extends Expr {
  static default = new ReadExpr()
  name = Expressions.Read

  prompt = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La pregunta requiere texto, recibió ${expr.type}`,
        }

      return null
    },
    'No se ha establecido una pregunta',
  )

  type = PrimaryType.string

  copy(): ReadExpr {
    const expr = new ReadExpr(this.id)
    expr.prompt = this.prompt.copy()
    return expr
  }
  static configSchema = Expr.configSchema.extend({
    prompt: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ReadExpr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const expr = new ReadExpr(data.id)
    expr.prompt._expr = Expr.createFrom(data.prompt)
    return expr
  }
  export(): z.infer<typeof ReadExpr.configSchema> {
    return {
      ...super.export(),
      prompt: this.prompt._expr?.export() ?? null,
    }
  }
}
