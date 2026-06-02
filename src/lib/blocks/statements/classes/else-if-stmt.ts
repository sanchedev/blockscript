import z from 'zod'
import { ErrorType } from '../../../errors'
import { PrimaryType } from '../../../types'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class ElseIfStmt extends Stmt {
  static default = new ElseIfStmt()
  name = Statements.ElseIf

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

  copy(): ElseIfStmt {
    const stmt = new ElseIfStmt(this.id)
    stmt.condition = this.condition.copy()
    stmt.body = this.body.copy() as BlockStmt
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    condition: z.unknown(),
    body: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ElseIfStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const elseIfStmt = new ElseIfStmt(data.id)
    elseIfStmt.condition._expr = Expr.createFrom(data.condition)
    const body = BlockStmt.createFrom(data.body)
    if (body == null) return null
    elseIfStmt.body = body
    return elseIfStmt
  }
  export(): z.infer<typeof ElseIfStmt.configSchema> {
    return {
      ...super.export(),
      condition: this.condition._expr?.export() ?? null,
      body: this.body.export(),
    }
  }
}
