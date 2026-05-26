import { useLocationPath } from '../contexts/location-path'
import {
  AssignExpr,
  AssignOpExpr,
  Expr,
  IncrementExpr,
  VariableExpr,
} from '../lib/blocks/expressions'
import {
  DoWhileStmt,
  ElseIfStmt,
  ElseStmt,
  ForStmt,
  IfStmt,
  Stmt,
  VariableStmt,
  WhileStmt,
} from '../lib/blocks/statements'
import { BlockStmt } from '../lib/blocks/statements/classes'
import { PrimaryType, type Type } from '../lib/types'
import { useGlobalStmt } from './global-stmt'

export function useVariableIdentifiers() {
  const { stmt } = useGlobalStmt()
  const locationPath = useLocationPath()

  const identifiers: string[] = []

  const go = (...indexes: number[]) => {
    let block = stmt
    for (const index of indexes) {
      const b = block.children[index]
      if (b instanceof BlockStmt) {
        block = b
      } else {
        return null
      }
    }
    return block
  }

  for (let i = locationPath.length - 1; i >= 0; i--) {
    const block = go(...locationPath.slice(0, i).map((l) => l.index))
    if (block == null) continue
    const index = locationPath[i].index
    for (let j = 0; j < index; j++) {
      const currentStmt = block.children[j]
      if (currentStmt instanceof VariableStmt) {
        identifiers.push(currentStmt.identifier)
      } else if (currentStmt instanceof ForStmt && currentStmt.identifier) {
        identifiers.push(currentStmt.identifier)
      }
    }
    // Include the current statement's own identifier if it's a ForStmt
    if (block.children[index] instanceof ForStmt) {
      const forStmt = block.children[index] as ForStmt
      if (forStmt.identifier) identifiers.push(forStmt.identifier)
    }
  }

  return identifiers
}

export function useVariableType(): (identifier: string) => Type | undefined {
  const { stmt } = useGlobalStmt()
  const locationPath = useLocationPath()

  const go = (...indexes: number[]) => {
    let block = stmt
    for (const index of indexes) {
      const b = block.children[index]
      if (b instanceof BlockStmt) {
        block = b
      } else if (b instanceof ForStmt) {
        block = b.body
      } else if (b instanceof WhileStmt || b instanceof DoWhileStmt) {
        block = b.body
      } else if (b instanceof IfStmt) {
        block = b.thenBody
      } else if (b instanceof ElseIfStmt || b instanceof ElseStmt) {
        block = b.body
      } else {
        return null
      }
    }
    return block
  }

  return (identifier: string) => {
    for (let i = locationPath.length - 1; i >= 0; i--) {
      const block = go(...locationPath.slice(0, i).map((l) => l.index))
      if (block == null) continue
      const index = locationPath[i].index
      for (let j = 0; j < index; j++) {
        const currentStmt = block.children[j]
        if (currentStmt instanceof VariableStmt) {
          if (currentStmt.identifier !== identifier) continue
          return currentStmt.expression.type
        } else if (currentStmt instanceof ForStmt) {
          if (currentStmt.identifier !== identifier) continue
          return PrimaryType.number
        }
      }
      // Check if the current statement itself is a ForStmt
      if (block.children[index] instanceof ForStmt) {
        const forStmt = block.children[index] as ForStmt
        if (forStmt.identifier === identifier) return PrimaryType.number
      }
    }
  }
}

export function useVariableUpdateReferences() {
  const { getParent } = useGlobalStmt()
  const parent = getParent()

  return (oldIdentifier: string, newIdentifier: string, type: Type) => {
    for (const expr of exploreToVariableExprs(parent, oldIdentifier)) {
      if (expr instanceof AssignExpr) {
        expr.edit(newIdentifier, expr.expression)
      } else if (expr instanceof VariableExpr) {
        expr.edit(newIdentifier, type)
      } else if (expr instanceof AssignOpExpr) {
        expr.edit(newIdentifier, expr.operator, expr.expression)
      } else if (expr instanceof IncrementExpr) {
        expr.edit(newIdentifier, expr.operator)
      }
    }
  }
}

function exploreToVariableExprs(stmt: BlockStmt, identifier: string) {
  const acc: (AssignExpr | AssignOpExpr | IncrementExpr | VariableExpr)[] = []

  const findInStmts = (stmt: Stmt, identifier: string) => {
    let children: Stmt[] = []
    if (stmt instanceof BlockStmt) {
      children = stmt.children
    } else {
      for (const key in stmt) {
        if (!Object.hasOwn(stmt, key)) continue

        const element = stmt[key as keyof typeof stmt]

        if (element instanceof BlockStmt) {
          children = element.children
          break
        }
      }
    }

    for (const stmtEl of children) {
      if ('expression' in stmtEl && stmtEl.expression instanceof Expr) {
        findInExpr(stmtEl.expression, identifier)
      }
      if (stmtEl instanceof Stmt) {
        findInStmts(stmtEl, identifier)
      }
    }
  }

  const findInExpr = (expr: Expr, identifier: string) => {
    if (expr instanceof AssignExpr) {
      if (expr.identifier !== identifier) return
      acc.push(expr)
    } else if (expr instanceof VariableExpr) {
      if (expr.identifier !== identifier) return
      acc.push(expr)
    } else if (expr instanceof AssignOpExpr) {
      if (expr.identifier !== identifier) return
      acc.push(expr)
    } else if (expr instanceof IncrementExpr) {
      if (expr.identifier !== identifier) return
      acc.push(expr)
    } else {
      for (const key in expr) {
        if (!Object.hasOwn(expr, key)) continue

        const something = expr[key as keyof typeof expr]

        if (something instanceof Expr) {
          findInExpr(something, identifier)
        }
      }
    }
  }

  findInStmts(stmt, identifier)

  return acc
}
