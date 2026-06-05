import { AssignExpr } from './blocks/expressions/classes/variables/assign'
import {
  AssignOp,
  AssignOpExpr,
} from './blocks/expressions/classes/variables/assign-op'
import {
  IncrementOp,
  IncrementExpr,
} from './blocks/expressions/classes/variables/increment'
import {
  ElseIfStmt,
  ExprStmt,
  type Stmt,
  WaitStmt,
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
import { PrintStmt } from './blocks/statements/classes/salida/print-stmt'
import { VariableStmt } from './blocks/statements/classes/variables/variable-stmt'
import { ElseStmt, IfStmt } from './blocks/statements'
import { Validator } from './validator/validator'
import { ErrorType, type EvalError, type Location } from './errors'
import { statementsLabels } from './blocks/statements/records/labels'
import type { ExprContainer } from './blocks/shared/classes/expr-container'

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
  onOutput?: (line: string) => void

  write(str: string) {
    this.output.push(str)
    this.onOutput?.(str)
  }
  addRuntimeErr(msg: string): never {
    throw {
      type: ErrorType.Runtime,
      message: msg,
      location: this.currentLocation,
    } as EvalError
  }

  nextAcc: (() => Stmt | undefined)[] = []
  peekAcc: (() => Stmt | undefined)[] = []
  next(): Stmt | undefined {
    return this.nextAcc.at(-1)?.()
  }
  peek(): Stmt | undefined {
    return this.peekAcc.at(-1)?.()
  }

  async interpret(statements: Stmt[]): Promise<InterpretResult> {
    const validator = new Validator()
    const errors = validator.validate(statements)
    if (errors.length > 0) {
      return { output: null, errors }
    }

    const env: Environment = { vars: new Map() }

    try {
      await this.executeStatements(statements, env)
    } catch (error) {
      return { output: null, errors: [error as EvalError] }
    }

    return { output: this.output, errors: null }
  }

  async executeStatements(stmts: Stmt[], env: Environment) {
    for (let i = 0; i < stmts.length; i++) {
      const stmt = stmts[i]

      this.nextAcc.push(() => stmts[++i])
      this.peekAcc.push(() => stmts[i + 1])
      console.log(i)
      this.currentLocation.push({ index: i, stmt: stmt.name })
      if (stmt instanceof ExprStmt) {
        await this.executeExprStmt(stmt, env)
      } else if (stmt instanceof PrintStmt) {
        await this.executePrintStmt(stmt, env)
      } else if (stmt instanceof VariableStmt) {
        await this.executeVariableStmt(stmt, env)
      } else if (stmt instanceof IfStmt) {
        await this.executeIfStmt(stmt as IfStmt, env)
      } else if (stmt instanceof WhileStmt) {
        await this.executeWhileStmt(stmt as WhileStmt, env)
      } else if (stmt instanceof DoWhileStmt) {
        await this.executeDoWhileStmt(stmt as DoWhileStmt, env)
      } else if (stmt instanceof ForStmt) {
        await this.executeForStmt(stmt as ForStmt, env)
      } else if (stmt instanceof WaitStmt) {
        await this.executeWaitStmt(stmt as WaitStmt, env)
      } else {
        this.addRuntimeErr(
          `Tipo de sentencia desconocida: ${statementsLabels[stmt.name]}`,
        )
      }
      this.currentLocation.pop()
      this.nextAcc.pop()
      this.peekAcc.pop()
    }
  }

  async executeExprStmt(stmt: ExprStmt, env: Environment) {
    await this.evaluateExprContainer(stmt.expression, env)
  }
  async executePrintStmt(stmt: PrintStmt, env: Environment) {
    const value = await this.evaluateExprContainer(stmt.expression, env)
    this.write(formatValue(value))
  }
  async executeVariableStmt(stmt: VariableStmt, env: Environment) {
    const value = await this.evaluateExprContainer(stmt.expression, env)
    env.vars.set(stmt.identifier, value)
  }
  async executeIfStmt(stmt: IfStmt, env: Environment) {
    const conditionValue = Boolean(
      await this.evaluateExprContainer(stmt.condition, env),
    )
    if (conditionValue) {
      await this.executeStatements(stmt.thenBody.children, env)
    }
    let hasExecuted = conditionValue
    while (this.peek() instanceof ElseIfStmt) {
      const elseIf = this.next() as ElseIfStmt
      const elseIfConditionValue = Boolean(
        await this.evaluateExprContainer(elseIf.condition, env),
      )
      if (!hasExecuted && elseIfConditionValue) {
        await this.executeStatements(elseIf.body.children, env)
        hasExecuted = true
      }
    }
    if (this.peek() instanceof ElseStmt) {
      const elseStmt = this.next() as ElseStmt
      if (!hasExecuted) {
        await this.executeStatements(elseStmt.body.children, env)
      }
    }
  }
  async executeWhileStmt(stmt: WhileStmt, env: Environment) {
    let max = 0
    while (await this.evaluateExprContainer(stmt.condition, env)) {
      max++
      await this.executeStatements(stmt.body.children, env)
      if (max >= 65536) {
        this.addRuntimeErr(
          'Se excedió el número máximo (65536) de ciclos que puede hacer un bucle.',
        )
      }
    }
  }

  async executeDoWhileStmt(stmt: DoWhileStmt, env: Environment) {
    let max = 0
    do {
      await this.executeStatements(stmt.body.children, env)
      max++
      if (max >= 65536) {
        this.addRuntimeErr(
          'Se excedió el número máximo (65536) de ciclos que puede hacer un bucle.',
        )
      }
    } while (await this.evaluateExprContainer(stmt.condition, env))
  }

  async executeForStmt(stmt: ForStmt, env: Environment) {
    const start = (await this.evaluateExprContainer(stmt.start, env)) as number
    const end = (await this.evaluateExprContainer(stmt.end, env)) as number
    const step = (await this.evaluateExprContainer(stmt.step, env)) as number
    let max = 0
    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
      env.vars.set(stmt.identifier, i)
      await this.executeStatements(stmt.body.children, env)
      max++
      if (max >= 65536) {
        this.addRuntimeErr(
          'Se excedió el número máximo (65536) de ciclos que puede hacer un bucle.',
        )
      }
    }
  }

  async executeWaitStmt(stmt: WaitStmt, env: Environment) {
    const duration = (await this.evaluateExprContainer(
      stmt.duration,
      env,
    )) as number
    await new Promise((resolve) => setTimeout(resolve, duration))
  }

  async evaluateExprContainer(container: ExprContainer, env: Environment) {
    return this.evaluate(container.get() ?? new NullLiteralExpr(), env)
  }

  // Expressions
  async evaluate(expr: Expr, env: Environment): Promise<unknown> {
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
      const value = await this.evaluateExprContainer(expr.expression, env)
      env.vars.set(expr.identifier, value)
      return value
    }
    if (expr instanceof AssignOpExpr) {
      return await this.evalAssignOp(expr, env)
    }
    if (expr instanceof IncrementExpr) {
      return this.evalIncrement(expr, env)
    }
    if (expr instanceof BinaryExpr) {
      return await this.evalBinary(expr, env)
    }
    if (expr instanceof BinaryCompExpr) {
      return await this.evalBinaryComp(expr, env)
    }
    if (expr instanceof ConcatExpr) {
      const left = String(await this.evaluateExprContainer(expr.left, env))
      const right = String(await this.evaluateExprContainer(expr.right, env))
      return left + right
    }
    if (expr instanceof ToStringExpr) {
      return formatValue(await this.evaluateExprContainer(expr.expression, env))
    }
    if (expr instanceof ToNumberExpr) {
      const raw = await this.evaluateExprContainer(expr.expression, env)
      const value = Number(raw)
      if (isNaN(value)) {
        this.addRuntimeErr(`El valor "${raw}" no se puede convertir a número.`)
      }
      return value
    }
    if (expr instanceof ToBooleanExpr) {
      return (
        String(await this.evaluateExprContainer(expr.expression, env)).length >
        0
      )
    }
    if (expr instanceof LogicalExpr) {
      const left = Boolean(await this.evaluateExprContainer(expr.left, env))
      const right = Boolean(await this.evaluateExprContainer(expr.right, env))
      return expr.operator === 'Y' ? left && right : left || right
    }
    if (expr instanceof ReadExpr) {
      const message = (await this.evaluateExprContainer(
        expr.prompt,
        env,
      )) as string
      const result = window.prompt(message) ?? ''
      this.write(`${message}${result}`)
      return result ?? null
    }

    return null
  }
  async evalBinary(expr: BinaryExpr, env: Environment) {
    const left = (await this.evaluateExprContainer(expr.left, env)) as number
    const right = (await this.evaluateExprContainer(expr.right, env)) as number

    const op = arithmeticOps[expr.operator]
    if (op == null) return null

    return op(left, right)
  }
  async evalBinaryComp(expr: BinaryCompExpr, env: Environment) {
    const left = (await this.evaluateExprContainer(expr.left, env)) as number
    const right = (await this.evaluateExprContainer(expr.right, env)) as number

    const op = comparisonOps[expr.operator]
    if (op == null) return null

    return op(left, right)
  }
  async evalAssignOp(expr: AssignOpExpr, env: Environment) {
    const current = env.vars.get(expr.identifier) as number
    const right = (await this.evaluateExprContainer(
      expr.expression,
      env,
    )) as number
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
  '%': (a: number, b: number) => a % b,
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
  [AssignOp.ModAssign]: (a, b) => a % b,
}
