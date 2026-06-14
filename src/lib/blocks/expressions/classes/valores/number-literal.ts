import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { field } from '../../../shared/field-decorator'
import type { VisitorExpr } from '../../../shared/visitor'

export class NumberLiteralExpr extends Expr {
  static default = new NumberLiteralExpr()
  name = Expressions.NumberLiteral

  @field.scalar(z.number())
  literal: number = 0

  type = PrimaryType.number

  edit(literal: number) {
    this.literal = literal
  }

  accept(visitor: VisitorExpr): void {
    visitor.visitNumberExpr(this)
  }

  toString(): string {
    return String(this.literal)
  }
}
