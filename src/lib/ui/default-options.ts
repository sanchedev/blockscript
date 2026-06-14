import { Expressions } from '../blocks/expressions/enum'
import { Statements } from '../blocks/statements/enum'
import { PrimaryType } from '../types'
import type { ExprId, ExprOptions } from './exprs'
import type { StmtOptions } from './stmts'

function newId(prefix: 'stmt' | 'expr'): `${typeof prefix}=${string}` {
  return `${prefix}=${crypto.randomUUID()}` as const
}

export function createDefaultExprOptions(name: Expressions): ExprOptions {
  const id = newId('expr')

  switch (name) {
    case Expressions.NumberLiteral:
      return { id, name: Expressions.NumberLiteral, type: PrimaryType.number, literal: 0 } as ExprOptions
    case Expressions.StringLiteral:
      return { id, name: Expressions.StringLiteral, type: PrimaryType.string, literal: '' } as ExprOptions
    case Expressions.BooleanLiteral:
      return { id, name: Expressions.BooleanLiteral, type: PrimaryType.boolean, literal: false } as ExprOptions
    case Expressions.NullLiteral:
      return { id, name: Expressions.NullLiteral, type: PrimaryType.null, literal: null } as ExprOptions
    case Expressions.Variable:
      return { id, name: Expressions.Variable, type: PrimaryType.null, identifier: '' } as ExprOptions
    case Expressions.Binary:
      return { id, name: Expressions.Binary, type: PrimaryType.number, left: '' as ExprId, operator: '+', right: '' as ExprId } as ExprOptions
    case Expressions.BinaryComp:
      return { id, name: Expressions.BinaryComp, type: PrimaryType.boolean, left: '' as ExprId, operator: '==', right: '' as ExprId } as ExprOptions
    case Expressions.Logical:
      return { id, name: Expressions.Logical, type: PrimaryType.boolean, left: '' as ExprId, operator: 'Y', right: '' as ExprId } as ExprOptions
    case Expressions.Concat:
      return { id, name: Expressions.Concat, type: PrimaryType.string, left: '' as ExprId, right: '' as ExprId } as ExprOptions
    case Expressions.Read:
      return { id, name: Expressions.Read, type: PrimaryType.string, prompt: '' as ExprId } as ExprOptions
    case Expressions.Assign:
      return { id, name: Expressions.Assign, type: PrimaryType.null, identifier: '', expr: '' as ExprId } as ExprOptions
    case Expressions.AssignOp:
      return { id, name: Expressions.AssignOp, type: PrimaryType.number, identifier: '', operator: '+=', expr: '' as ExprId } as ExprOptions
    case Expressions.Increment:
      return { id, name: Expressions.Increment, type: PrimaryType.number, identifier: '', operator: '++' } as ExprOptions
    case Expressions.ToString:
      return { id, name: Expressions.ToString, type: PrimaryType.string, expr: '' as ExprId } as ExprOptions
    case Expressions.ToNumber:
      return { id, name: Expressions.ToNumber, type: PrimaryType.number, expr: '' as ExprId } as ExprOptions
    case Expressions.ToBoolean:
      return { id, name: Expressions.ToBoolean, type: PrimaryType.boolean, expr: '' as ExprId } as ExprOptions
    default:
      return { id, name: Expressions.Expression, type: PrimaryType.null } as ExprOptions
  }
}

export function createDefaultStmtOptions(name: Statements): StmtOptions {
  const id = newId('stmt')

  switch (name) {
    case Statements.Block:
      return { id, name: Statements.Block, stmts: [] } as StmtOptions
    case Statements.Expr:
      return { id, name: Statements.Expr, expr: '' as ExprId } as StmtOptions
    case Statements.Print:
      return { id, name: Statements.Print, expr: '' as ExprId } as StmtOptions
    case Statements.Variable:
      return { id, name: Statements.Variable, identifier: '', expr: '' as ExprId } as StmtOptions
    case Statements.If:
      return { id, name: Statements.If, condition: '' as ExprId, body: newId('stmt') } as StmtOptions
    case Statements.ElseIf:
      return { id, name: Statements.ElseIf, condition: '' as ExprId, body: newId('stmt') } as StmtOptions
    case Statements.Else:
      return { id, name: Statements.Else, body: newId('stmt') } as StmtOptions
    case Statements.While:
      return { id, name: Statements.While, condition: '' as ExprId, body: newId('stmt') } as StmtOptions
    case Statements.DoWhile:
      return { id, name: Statements.DoWhile, condition: '' as ExprId, body: newId('stmt') } as StmtOptions
    case Statements.For:
      return {
        id, name: Statements.For, identifier: 'i',
        start: '' as ExprId, end: '' as ExprId, step: '' as ExprId,
        body: newId('stmt'),
      } as StmtOptions
    case Statements.Wait:
      return { id, name: Statements.Wait, duration: '' as ExprId } as StmtOptions
    case Statements.Break:
      return { id, name: Statements.Break } as StmtOptions
    case Statements.Continue:
      return { id, name: Statements.Continue } as StmtOptions
    default:
      return { id, name: Statements.Stmt } as StmtOptions
  }
}
