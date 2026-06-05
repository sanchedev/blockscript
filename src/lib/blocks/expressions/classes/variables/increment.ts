import z from 'zod'
import { PrimaryType } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { field } from '../../../shared/field-decorator'

export enum IncrementOp {
  Increment = '++',
  Decrement = '--',
}

export class IncrementExpr extends Expr {
  static default = new IncrementExpr()
  name = Expressions.Increment

  @field.scalar(z.string())
  identifier: string = ''

  @field.scalar(z.enum(IncrementOp))
  operator: IncrementOp = IncrementOp.Increment

  type = PrimaryType.number

  changeIdentifier(identifier: string) { this.identifier = identifier }
  changeOperator(operator: IncrementOp) { this.operator = operator }
}
