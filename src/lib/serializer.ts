/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stmt } from './blocks/statements/classes/stmt'
import { Expr } from './blocks/expressions/classes/expr'
import { statementsClasses } from './blocks/statements/records/classes'
import { expressionsClasses } from './blocks/expressions/records/classes'

export function serialize(node: Stmt | Expr): any {
  const data: Record<string, any> = {}
  for (const key of Object.keys(node)) {
    const val = (node as any)[key]
    if (val instanceof Stmt || val instanceof Expr) {
      data[key] = serialize(val)
    } else if (Array.isArray(val)) {
      data[key] = val.map((v: any) => (v instanceof Stmt || v instanceof Expr ? serialize(v) : v))
    } else {
      data[key] = val
    }
  }
  return data
}

function isNode(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && 'name' in value
}

export function deserialize(data: unknown): Stmt | Expr {
  if (!isNode(data)) throw new Error('Invalid serialized data')

  const name = data.name as string
  const StmtClass = statementsClasses[name as keyof typeof statementsClasses]

  if (StmtClass) {
    const instance = new StmtClass(data.id as string) as any
    for (const key of Object.keys(data)) {
      if (key === 'name' || key === 'id') continue
      const val = data[key]
      if (val == null) continue
      if (Array.isArray(val)) {
        instance[key] = val.map((v: unknown) => (isNode(v) ? deserialize(v) : v))
      } else if (isNode(val)) {
        instance[key] = deserialize(val)
      } else {
        instance[key] = val
      }
    }
    return instance as Stmt
  }

  const ExprClass = expressionsClasses[name as keyof typeof expressionsClasses]
  if (ExprClass) {
    const instance = new ExprClass() as any
    for (const key of Object.keys(data)) {
      if (key === 'name') continue
      const val = data[key]
      if (val == null) continue
      if (Array.isArray(val)) {
        instance[key] = val.map((v: unknown) => (isNode(v) ? deserialize(v) : v))
      } else if (isNode(val)) {
        instance[key] = deserialize(val)
      } else {
        instance[key] = val
      }
    }
    return instance as Expr
  }

  throw new Error(`Unknown node type: ${name}`)
}
