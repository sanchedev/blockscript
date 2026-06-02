import z from 'zod'
import { ErrorType } from '../../../errors'
import { PrimaryType } from '../../../types'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'

export class WaitStmt extends Stmt {
  static default = new WaitStmt()
  name = Statements.Wait

  duration = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El tiempo de espera debe ser número, recibió ${expr.type}`,
        }

      return null
    },
    'No se ha establecido un tiempo de espera',
  )

  copy(): WaitStmt {
    const stmt = new WaitStmt(this.id)
    stmt.duration = this.duration.copy()
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    duration: z.unknown(),
  })
  static createFrom(rawConfig: unknown): WaitStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const waitStmt = new WaitStmt(data.id)
    waitStmt.duration._expr = Expr.createFrom(data.duration)
    return waitStmt
  }
  export(): z.infer<typeof WaitStmt.configSchema> {
    return {
      ...super.export(),
      duration: this.duration._expr?.export() ?? null,
    }
  }
}
