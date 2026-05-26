import { AssignExpr } from './blocks/expressions/classes/variables/assign'
import { AssignOp, AssignOpExpr } from './blocks/expressions/classes/variables/assign-op'
import {
  IncrementOp,
  IncrementExpr,
} from './blocks/expressions/classes/variables/increment'
import {
  ElseIfStmt,
  ExprStmt,
  type Stmt,
  WhileStmt,
  DoWhileStmt,
  ForStmt,
} from './blocks/statements'
import type { Expr } from './blocks/expressions'
import { BinaryExpr } from './blocks/expressions/classes/operaciones/binary'
import { BinaryCompExpr } from './blocks/expressions/classes/operaciones/binary-comp'
import { ConcatExpr } from './blocks/expressions/classes/conversion/concat'
import { ToStringExpr } from './blocks/expressions/classes/conversion/to-string'
import { ToNumberExpr } from './blocks/expressions/classes/conversion/to-number'
import { ToBooleanExpr } from './blocks/expressions/classes/conversion/to-boolean'
import { LogicalExpr } from './blocks/expressions/classes/operaciones/logical'
import { NumberLiteralExpr } from './blocks/expressions/classes/valores/number-literal'
import { StringLiteralExpr } from './blocks/expressions/classes/valores/string-literal'
import { BooleanLiteralExpr } from './blocks/expressions/classes/valores/boolean-literal'
import { NullLiteralExpr } from './blocks/expressions/classes/valores/null-literal'
import { VariableExpr } from './blocks/expressions/classes/variables/variable'
import { ReadExpr } from './blocks/expressions/classes/valores/read'
import { PrintStmt } from './blocks/statements/classes/print-stmt'
import { VariableStmt } from './blocks/statements/classes/variable-stmt'
import { ElseStmt, IfStmt } from './blocks/statements'
import { validate } from './validator/validator'
import { ErrorType, type EvalError, type Location } from './errors'
import { statementsLabels } from './blocks/statements/records/labels'

interface Environment {
  vars: Map<string, unknown>
}

export type InterpretResult =
  | {
      output: null
      errors: EvalError[]
    }
  | {
      output: string[]
      errors: null
    }

function formatValue(value: unknown): string {
  if (value === null) return 'nulo'
  if (typeof value === 'boolean') return value ? 'verdadero' : 'falso'
  return String(value)
}

export class Interpreter {
  currentLocation: Location[] = []
  output: string[] = []

  write(str: string) {
    this.output.push(str)
  }
  addRuntimeErr(msg: string): never {
    throw {
      type: ErrorType.Runtime,
      message: msg,
      location: this.currentLocation,
    } as EvalError
  }

  next(): Stmt | undefined {
    return
  }
  peek(): Stmt | undefined {
    return
  }

  interpret(statements: Stmt[]): InterpretResult {
    const errors = validate(statements)
    if (errors.length > 0) {
      return { output: null, errors }
    }

    const env: Environment = { vars: new Map() }

    try {
      this.executeStatements(statements, env)
    } catch (error) {
      return { output: null, errors: [error as EvalError] }
    }

    return { output: this.output, errors: null }
  }

  executeStatements(stmts: Stmt[], env: Environment) {
    let index = 0
    for (const stmt of stmts) {
      this.next = () => stmts[++index]
      this.peek = () => stmts[index + 1]
      this.currentLocation.push({ index, stmt: stmt.name })
      if (stmt instanceof ExprStmt) {
        this.executeExprStmt(stmt, env)
      } else if (stmt instanceof PrintStmt) {
        this.executePrintStmt(stmt, env)
      } else if (stmt instanceof VariableStmt) {
        this.executeVariableStmt(stmt, env)
      } else if (stmt instanceof IfStmt) {
        this.executeIfStmt(stmt as IfStmt, env)
      } else if (stmt instanceof WhileStmt) {
        this.executeWhileStmt(stmt as WhileStmt, env)
      } else if (stmt instanceof DoWhileStmt) {
        this.executeDoWhileStmt(stmt as DoWhileStmt, env)
      } else if (stmt instanceof ForStmt) {
        this.executeForStmt(stmt as ForStmt, env)
      } else {
        this.addRuntimeErr(
          `Tipo de sentencia desconocida: ${statementsLabels[stmt.name]}`,
        )
      }
      this.currentLocation.pop()
      index++
    }
  }
  executeExprStmt(stmt: ExprStmt, env: Environment) {
    this.evaluate(stmt.expression, env)
  }
  executePrintStmt(stmt: PrintStmt, env: Environment) {
    const value = this.evaluate(stmt.expression, env)
    this.write(formatValue(value))
  }
  executeVariableStmt(stmt: VariableStmt, env: Environment) {
    const value = this.evaluate(stmt.expression, env)
    env.vars.set(stmt.identifier, value)
  }
  executeIfStmt(stmt: IfStmt, env: Environment) {
    const conditionValue = Boolean(this.evaluate(stmt.condition, env))
    if (conditionValue) {
      this.executeStatements(stmt.thenBody.children, env)
    }
    let hasExecuted = conditionValue
    while (this.peek() instanceof ElseIfStmt) {
      const elseIf = this.next() as ElseIfStmt
      const elseIfConditionValue = Boolean(this.evaluate(elseIf.condition, env))
      if (!hasExecuted && elseIfConditionValue) {
        this.executeStatements(elseIf.body.children, env)
        hasExecuted = true
      }
      if (this.peek() instanceof ElseStmt) {
        const elseStmt = this.next() as ElseStmt
        if (!hasExecuted) {
          this.executeStatements(elseStmt.body.children, env)
        }
        break
      }
    }
  }
  executeWhileStmt(stmt: WhileStmt, env: Environment) {
    console.log(this.evaluate(stmt.condition, env))
    let max = 0
    while (this.evaluate(stmt.condition, env)) {
      max++
      this.executeStatements(stmt.body.children, env)
      if (max >= 65536) {
        this.addRuntimeErr(
          'Se excedió el número máximo (65536) de ciclos que puede hacer un bucle.',
        )
      }
    }
  }

  executeDoWhileStmt(stmt: DoWhileStmt, env: Environment) {
    let max = 0
    do {
      this.executeStatements(stmt.body.children, env)
      max++
      if (max >= 65536) {
        this.addRuntimeErr(
          'Se excedió el número máximo (65536) de ciclos que puede hacer un bucle.',
        )
      }
    } while (this.evaluate(stmt.condition, env))
  }

  executeForStmt(stmt: ForStmt, env: Environment) {
    const start = this.evaluate(stmt.start, env) as number
    const end = this.evaluate(stmt.end, env) as number
    const step = this.evaluate(stmt.step, env) as number
    let max = 0
    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
      env.vars.set(stmt.identifier, i)
      this.executeStatements(stmt.body.children, env)
      max++
      if (max >= 65536) {
        this.addRuntimeErr(
          'Se excedió el número máximo (65536) de ciclos que puede hacer un bucle.',
        )
      }
    }
  }

  // Expressions
  evaluate(expr: Expr, env: Environment): unknown {
    if (expr instanceof NumberLiteralExpr) {
      return expr.literal
    }
    if (expr instanceof StringLiteralExpr) {
      return expr.literal
    }
    if (expr instanceof BooleanLiteralExpr) {
      return expr.literal
    }
    if (expr instanceof NullLiteralExpr) {
      return expr.literal
    }
    if (expr instanceof VariableExpr) {
      return env.vars.get((expr as VariableExpr).identifier) ?? null
    }
    if (expr instanceof AssignExpr) {
      const value = this.evaluate(expr.expression, env)
      env.vars.set(expr.identifier, value)
      return value
    }
    if (expr instanceof AssignOpExpr) {
      return this.evalAssignOp(expr, env)
    }
    if (expr instanceof IncrementExpr) {
      return this.evalIncrement(expr, env)
    }
    if (expr instanceof BinaryExpr) {
      return this.evalBinary(expr, env)
    }
    if (expr instanceof BinaryCompExpr) {
      return this.evalBinaryComp(expr, env)
    }
    if (expr instanceof ConcatExpr) {
      const left = String(this.evaluate(expr.left, env))
      const right = String(this.evaluate(expr.right, env))
      return left + right
    }
    if (expr instanceof ToStringExpr) {
      return formatValue(this.evaluate(expr.expression, env))
    }
    if (expr instanceof ToNumberExpr) {
      const raw = this.evaluate(expr.expression, env)
      const value = Number(raw)
      if (isNaN(value)) {
        this.addRuntimeErr(`El valor "${raw}" no se puede convertir a número.`)
      }
      return value
    }
    if (expr instanceof ToBooleanExpr) {
      return String(this.evaluate(expr.expression, env)).length > 0
    }
    if (expr instanceof LogicalExpr) {
      const left = Boolean(this.evaluate(expr.left, env))
      const right = Boolean(this.evaluate(expr.right, env))
      return expr.operator === 'Y' ? left && right : left || right
    }
    if (expr instanceof ReadExpr) {
      const message = this.evaluate(expr.prompt, env) as string
      const result = window.prompt(message) ?? ''
      this.write(`${message}${result}`)
      return result ?? null
    }

    return null
  }
  evalBinary(expr: BinaryExpr, env: Environment) {
    const left = this.evaluate(expr.left, env) as number
    const right = this.evaluate(expr.right, env) as number

    const op = arithmeticOps[expr.operator]
    if (op == null) return null

    return op(left, right)
  }
  evalBinaryComp(expr: BinaryCompExpr, env: Environment) {
    const left = this.evaluate(expr.left, env) as number
    const right = this.evaluate(expr.right, env) as number

    const op = comparisonOps[expr.operator]
    if (op == null) return null

    return op(left, right)
  }
  evalAssignOp(expr: AssignOpExpr, env: Environment) {
    const current = env.vars.get(expr.identifier) as number
    const right = this.evaluate(expr.expression, env) as number
    const result = assignOps[expr.operator](current, right)
    env.vars.set(expr.identifier, result)
    return result
  }
  evalIncrement(expr: IncrementExpr, env: Environment) {
    const current = env.vars.get(expr.identifier) as number
    const result =
      expr.operator === IncrementOp.Increment ? current + 1 : current - 1
    env.vars.set(expr.identifier, result)
    return result
  }
}

const arithmeticOps = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
}

const comparisonOps = {
  '>': (a: number, b: number) => a > b,
  '<': (a: number, b: number) => a < b,
  '>=': (a: number, b: number) => a >= b,
  '<=': (a: number, b: number) => a <= b,
  '==': (a: unknown, b: unknown) => a === b,
  '!=': (a: unknown, b: unknown) => a !== b,
}

const assignOps: Record<AssignOp, (a: number, b: number) => number> = {
  [AssignOp.AddAssign]: (a, b) => a + b,
  [AssignOp.SubAssign]: (a, b) => a - b,
  [AssignOp.MulAssign]: (a, b) => a * b,
  [AssignOp.DivAssign]: (a, b) => a / b,
}
