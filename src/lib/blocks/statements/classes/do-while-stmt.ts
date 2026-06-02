import z from 'zod'
import { ErrorType } from '../../../errors'
import { PrimaryType } from '../../../types'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class DoWhileStmt extends Stmt {
  static default = new DoWhileStmt()
  name = Statements.DoWhile

  condition = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.boolean)
        return {
          type: ErrorType.Type,
          message: `La condición debe ser V / F, recibió ${expr.type}`,
        }

      return null
    },
    'No se ha establecido una condición',
  )
  body: BlockStmt = new BlockStmt()

  copy(): DoWhileStmt {
    const stmt = new DoWhileStmt(this.id)
    stmt.body = this.body.copy() as BlockStmt
    stmt.condition = this.condition.copy()
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    condition: z.unknown(),
    body: z.unknown(),
  })
  static createFrom(rawConfig: unknown): DoWhileStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const doWhileStmt = new DoWhileStmt(data.id)
    doWhileStmt.condition._expr = Expr.createFrom(data.condition)
    const body = BlockStmt.createFrom(data.body)
    if (body == null) return null
    doWhileStmt.body = body
    return doWhileStmt
  }
  export(): z.infer<typeof DoWhileStmt.configSchema> {
    return {
      ...super.export(),
      condition: this.condition._expr?.export() ?? null,
      body: this.body.export(),
    }
  }
}
