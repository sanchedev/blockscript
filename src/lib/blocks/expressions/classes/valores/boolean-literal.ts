import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { field } from '../../../shared/field-decorator'

export class BooleanLiteralExpr extends Expr {
  static default = new BooleanLiteralExpr()
  name = Expressions.BooleanLiteral

  @field.scalar(z.boolean())
  literal: boolean = false

  type = PrimaryType.boolean

  edit(literal: boolean) { this.literal = literal }

  toString(): string {
    return this.literal ? 'V' : 'F'
  }
}
