import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { field } from '../../../shared/field-decorator'

export class StringLiteralExpr extends Expr {
  static default = new StringLiteralExpr()
  name = Expressions.StringLiteral

  @field.scalar(z.string())
  literal: string = 'hola'

  type = PrimaryType.string

  edit(literal: string) {
    this.literal = literal
  }
}
