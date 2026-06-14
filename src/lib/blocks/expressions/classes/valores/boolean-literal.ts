import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { field } from '../../../shared/field-decorator'
import type { VisitorExpr } from '../../../shared/visitor'

export class BooleanLiteralExpr extends Expr {
  static default = new BooleanLiteralExpr()
  name = Expressions.BooleanLiteral

  @field.scalar(z.boolean())
  literal: boolean = false

  type = PrimaryType.boolean

  edit(literal: boolean) {
    this.literal = literal
  }

  accept(visitor: VisitorExpr): void {
    visitor.visitBooleanExpr(this)
  }

  toString(): string {
    return this.literal ? 'V' : 'F'
  }
}
