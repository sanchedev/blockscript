import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { field } from '../../../shared/field-decorator'
import type { VisitorExpr } from '../../../shared/visitor'

export class NullLiteralExpr extends Expr {
  static default = new NullLiteralExpr()
  name = Expressions.NullLiteral

  @field.scalar(z.null())
  literal: null = null

  accept(visitor: VisitorExpr): void {
    visitor.visitNullExpr(this)
  }

  toString(): string {
    return 'nulo'
  }
}
