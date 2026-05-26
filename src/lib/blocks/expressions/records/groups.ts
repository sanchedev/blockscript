import { Expressions } from '../enum'

export interface ExpressionsGroup {
  key: string
  title: string
  exprs: Expressions[]
}

export const expressionsGroups: ExpressionsGroup[] = [
  {
    key: 'valores',
    title: 'Valores',
    exprs: [
      Expressions.StringLiteral,
      Expressions.NumberLiteral,
      Expressions.BooleanLiteral,
      Expressions.NullLiteral,
      Expressions.Read,
    ],
  },
  {
    key: 'operaciones',
    title: 'Operaciones',
    exprs: [
      Expressions.Binary,
      Expressions.BinaryComp,
      Expressions.Logical,
    ],
  },
  {
    key: 'variables',
    title: 'Variables',
    exprs: [
      Expressions.Variable,
      Expressions.Assign,
      Expressions.AssignOp,
      Expressions.Increment,
    ],
  },
  {
    key: 'conversion',
    title: 'Conversión',
    exprs: [
      Expressions.ToString,
      Expressions.ToNumber,
      Expressions.ToBoolean,
      Expressions.Concat,
    ],
  },
]
