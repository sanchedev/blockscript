import { Statements } from '../enum'

export interface StatementsGroup {
  key: string
  title: string
  stmts: Statements[]
}

export const statementsGroups: StatementsGroup[] = [
  {
    key: 'expresiones',
    title: 'Expresiones',
    stmts: [Statements.Expr],
  },
  {
    key: 'variables',
    title: 'Variables',
    stmts: [Statements.Variable],
  },
  {
    key: 'salida',
    title: 'Salida',
    stmts: [Statements.Print],
  },
  {
    key: 'condicionales',
    title: 'Condicionales',
    stmts: [Statements.If, Statements.ElseIf, Statements.Else],
  },
  {
    key: 'bucles',
    title: 'Bucles',
    stmts: [Statements.While, Statements.DoWhile, Statements.For],
  },
]
