import z from 'zod'
import { PrimaryType, type Type } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { field } from '../../../shared/field-decorator'
import type { VisitorExpr } from '../../../shared/visitor'

export class VariableExpr extends Expr {
  static default = new VariableExpr()
  name = Expressions.Variable

  @field.scalar(z.string())
  identifier: string = ''

  @field.scalar(z.enum(PrimaryType))
  type: Type = PrimaryType.null

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }
  changeType(type: Type) {
    this.type = type
  }

  accept(visitor: VisitorExpr): void {
    visitor.visitVariableExpr(this)
  }

  toString(): string {
    return this.identifier || '?'
  }
}
