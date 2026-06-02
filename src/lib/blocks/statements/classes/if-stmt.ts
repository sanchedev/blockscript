import z from 'zod'
import { ErrorType } from '../../../errors'
import { PrimaryType } from '../../../types'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'
import { Expr } from '../../expressions'

export class IfStmt extends Stmt {
  static default = new IfStmt()
  name = Statements.If

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
  thenBody: BlockStmt = new BlockStmt()

  copy(): IfStmt {
    const stmt = new IfStmt(this.id)
    stmt.condition = this.condition.copy()
    stmt.thenBody = this.thenBody.copy() as BlockStmt
    return stmt
  }

  static configSchema = Stmt.configSchema.extend({
    condition: z.unknown(),
    thenBody: z.unknown(),
  })
  static createFrom(rawConfig: unknown): IfStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const ifStmt = new IfStmt(data.id)
    ifStmt.condition._expr = Expr.createFrom(data.condition)
    const thenBody = BlockStmt.createFrom(data.thenBody)
    if (thenBody == null) return null
    ifStmt.thenBody = thenBody
    return ifStmt
  }
  export(): z.infer<typeof IfStmt.configSchema> {
    return {
      ...super.export(),
      condition: this.condition._expr?.export(),
      thenBody: this.thenBody.export(),
    }
  }
}
