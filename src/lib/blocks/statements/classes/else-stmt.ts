import z from 'zod'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class ElseStmt extends Stmt {
  static default = new ElseStmt()
  name = Statements.Else

  body: BlockStmt = new BlockStmt()

  copy(): ElseStmt {
    const stmt = new ElseStmt(this.id)
    stmt.body = this.body.copy() as BlockStmt
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    body: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ElseStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const elseStmt = new ElseStmt(data.id)
    const body = BlockStmt.createFrom(data.body)
    if (body == null) return null
    elseStmt.body = body
    return elseStmt
  }
  export(): z.infer<typeof ElseStmt.configSchema> {
    return {
      ...super.export(),
      body: this.body.export(),
    }
  }
}
