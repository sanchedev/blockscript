import z from 'zod'
import { ErrorType } from '../../../errors'
import { PrimaryType } from '../../../types'
import { Expr } from '../../expressions'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class ForStmt extends Stmt {
  static default = new ForStmt()
  name = Statements.For

  identifier = ''
  start = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El valor inicial debe ser número, recibió ${expr.type}`,
        }

      return null
    },
    `No se ha establecido un valor inicial`,
  )
  end = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El valor final debe ser número, recibió ${expr.type}`,
        }

      return null
    },
    `No se ha establecido un valor final`,
  )
  step = new ExprContainer(
    this,
    (expr) => {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El paso debe ser número, recibió ${expr.type}`,
        }

      return null
    },
    `No se ha establecido un paso`,
  )
  body: BlockStmt = new BlockStmt()

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  copy(): ForStmt {
    const stmt = new ForStmt(this.id)
    stmt.identifier = this.identifier
    stmt.start = this.start.copy()
    stmt.end = this.end.copy()
    stmt.step = this.step.copy()
    stmt.body = this.body.copy() as BlockStmt
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    identifier: z.string(),
    start: z.unknown(),
    end: z.unknown(),
    step: z.unknown(),
    body: z.unknown(),
  })
  static createFrom(rawConfig: unknown): ForStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const forStmt = new ForStmt(data.id)
    forStmt.identifier = data.identifier
    forStmt.start._expr = Expr.createFrom(data.start)
    forStmt.end._expr = Expr.createFrom(data.end)
    forStmt.step._expr = Expr.createFrom(data.step)
    const body = BlockStmt.createFrom(data.body)
    if (body == null) return null
    forStmt.body = body
    return forStmt
  }
  export(): z.infer<typeof ForStmt.configSchema> {
    return {
      ...super.export(),
      identifier: this.identifier,
      start: this.start._expr?.export() ?? null,
      end: this.end._expr?.export() ?? null,
      step: this.step._expr?.export() ?? null,
      body: this.body.export(),
    }
  }
}
