import z from 'zod'
import { ErrorType } from '../../../../errors'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { BlockStmt } from '../block-stmt'
import { field } from '../../../shared/field-decorator'

export class ForStmt extends Stmt {
  static default = new ForStmt()
  name = Statements.For

  @field.scalar(z.string())
  identifier: string = ''

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El valor inicial debe ser número, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un valor inicial',
  })
  start = new ExprContainer(this)

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El valor final debe ser número, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un valor final',
  })
  end = new ExprContainer(this)

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El paso debe ser número, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un paso',
  })
  step = new ExprContainer(this)

  @field.blockStmt()
  body: BlockStmt = new BlockStmt()

  changeIdentifier(identifier: string) { this.identifier = identifier }

  toString(): string {
    return `para ${this.identifier} desde ${this.start.get()?.toString() ?? '?'} hasta ${this.end.get()?.toString() ?? '?'} paso ${this.step.get()?.toString() ?? '?'} ${this.body.toString()}`
  }
}
