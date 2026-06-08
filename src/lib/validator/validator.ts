import { AssignExpr } from '../blocks/expressions/classes/variables/assign'
import { AssignOpExpr } from '../blocks/expressions/classes/variables/assign-op'
import { IncrementExpr } from '../blocks/expressions/classes/variables/increment'
import { NullLiteralExpr, type Expr } from '../blocks/expressions'
import { BinaryExpr } from '../blocks/expressions/classes/operaciones/binary'
import { BinaryCompExpr } from '../blocks/expressions/classes/operaciones/binary-comp'
import { ConcatExpr } from '../blocks/expressions/classes/conversion/concat'
import { LogicalExpr } from '../blocks/expressions/classes/operaciones/logical'
import { ToNumberExpr } from '../blocks/expressions/classes/conversion/to-number'
import { ToBooleanExpr } from '../blocks/expressions/classes/conversion/to-boolean'
import { VariableExpr } from '../blocks/expressions/classes/variables/variable'
import { ReadExpr } from '../blocks/expressions/classes/valores/read'
import { ExprStmt, type Stmt } from '../blocks/statements'
import { PrintStmt } from '../blocks/statements/classes/salida/print-stmt'
import { VariableStmt } from '../blocks/statements/classes/variables/variable-stmt'
import {
  IfStmt,
  ElseIfStmt,
  ElseStmt,
  WaitStmt,
  WhileStmt,
  DoWhileStmt,
  ForStmt,
} from '../blocks/statements'
import {
  ErrorType,
  type ErrorInfo,
  type EvalError,
  type Location,
} from '../errors'
import { BlockStmt } from '../blocks/statements/classes/block-stmt'
import { Defineds } from './defineds'
import { PrimaryType } from '../types'
import { statementsLabels } from '../blocks/statements/records/labels'
import type { ExprContainer } from '../blocks/shared/classes/expr-container'

export class Validator {
  defineds: Defineds
  #locationPath: Location[]

  constructor(
    definedsParent?: Defineds,
    parentLocationPath: Location[] = [],
    edit?: (validator: Validator) => void,
  ) {
    this.defineds = new Defineds(definedsParent)
    this.#locationPath = parentLocationPath.slice()
    edit?.(this)
  }

  #errors: EvalError[] = []

  #addError(type: ErrorType, message: string) {
    this.#errors.push({
      type,
      message,
      location: this.#locationPath.slice(),
    })
  }

  #addErrorByInfo(info: ErrorInfo | null | undefined) {
    if (info == null) return
    this.#addError(info.type, info.message)
  }

  validate(statements: Stmt[]): EvalError[] {
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      if (stmt == null) continue
      const location = { index: i, stmt: stmt.name, text: stmt.toString() }
      this.#locationPath.push(location)

      const next = () => {
        this.#locationPath.at(-1)!.index++
        return ++i
      }

      if (stmt instanceof BlockStmt) {
        this.#validateBlock(stmt)
      } else if (stmt instanceof VariableStmt) {
        if (stmt.identifier === '') {
          this.#addError(
            ErrorType.MissingIdentifier,
            `Las variables deben tener un identificador`,
          )
        } else {
          this.#addErrorByInfo(
            this.defineds.define(
              stmt.identifier,
              stmt.expression.get()?.type ?? PrimaryType.null,
              this.#locationPath.map((l) => l.index),
            ),
          )
        }

        this.#validateExprContainer(stmt.expression)
      } else if (stmt instanceof PrintStmt) {
        this.#validateExprContainer(stmt.expression)
      } else if (stmt instanceof ExprStmt) {
        this.#validateExprContainer(stmt.expression)
      } else if (stmt instanceof IfStmt) {
        this.#validateExprContainer(stmt.condition)
        this.#validateBlock(stmt.thenBody)

        while (statements[i + 1] instanceof ElseIfStmt) {
          const stmt = statements[next()] as ElseIfStmt
          this.#validateExprContainer(stmt.condition)
          this.#validateBlock(stmt.body)
        }
        if (statements[i + 1] instanceof ElseStmt) {
          const elseStmt = statements[next()] as ElseStmt
          this.#validateBlock(elseStmt.body)
        }
      } else if (stmt instanceof ElseIfStmt || stmt instanceof ElseStmt) {
        this.#addError(
          ErrorType.InvalidStatement,
          `Un '${statementsLabels[stmt.name]}' solo puede ir después de un '${statementsLabels['if-stmt']}' o un '${statementsLabels['else-if-stmt']}'`,
        )
      } else if (stmt instanceof WhileStmt) {
        this.#validateExprContainer(stmt.condition)
        this.#validateBlock(stmt.body)
      } else if (stmt instanceof DoWhileStmt) {
        this.#validateBlock(stmt.body)
        this.#validateExprContainer(stmt.condition)
      } else if (stmt instanceof ForStmt) {
        if (stmt.identifier === '') {
          this.#addError(
            ErrorType.MissingIdentifier,
            `El bucle debe tener una variable`,
          )
        }

        this.#validateExprContainer(stmt.start)
        this.#validateExprContainer(stmt.end)
        this.#validateExprContainer(stmt.step)

        this.#validateBlock(stmt.body, (validator) => {
          if (stmt.identifier !== '') {
            validator.defineds.define(
              stmt.identifier,
              PrimaryType.number,
              this.#locationPath.map((l) => l.index),
            )
          }
        })
      } else if (stmt instanceof WaitStmt) {
        this.#validateExprContainer(stmt.duration)
      }

      this.#locationPath.pop()
    }

    return this.#errors
  }

  #validateBlock(block: BlockStmt, edit?: (validator: Validator) => void) {
    const validator = new Validator(this.defineds, this.#locationPath, edit)
    this.#errors.push(...validator.validate(block.children))
  }

  #validateExprContainer<T extends Expr | Stmt>(container: ExprContainer<T>) {
    this.#addErrorByInfo(container.validate())
    this.#validateExpr(container.get() ?? new NullLiteralExpr())
  }

  #validateExpr(expr: Expr) {
    if (expr instanceof BinaryExpr) {
      this.#validateExprContainer(expr.left)
      this.#validateExprContainer(expr.right)
    } else if (expr instanceof BinaryCompExpr) {
      this.#validateExprContainer(expr.left)
      this.#validateExprContainer(expr.right)
    } else if (expr instanceof VariableExpr) {
      this.#addErrorByInfo(this.defineds.get(expr.identifier))
    } else if (expr instanceof AssignExpr) {
      this.#validateExprContainer(expr.expression)
      this.#addErrorByInfo(
        this.defineds.assing(
          expr.identifier,
          expr.expression.get()?.type ?? PrimaryType.null,
        ),
      )
    } else if (expr instanceof AssignOpExpr) {
      this.#validateExprContainer(expr.expression)
      this.#addErrorByInfo(
        this.defineds.assing(expr.identifier, PrimaryType.number),
      )
    } else if (expr instanceof IncrementExpr) {
      this.#addErrorByInfo(
        this.defineds.assing(expr.identifier, PrimaryType.number),
      )
    } else if (expr instanceof ConcatExpr) {
      this.#validateExprContainer(expr.left)
      this.#validateExprContainer(expr.right)
    } else if (expr instanceof ReadExpr) {
      this.#validateExprContainer(expr.prompt)
    } else if (expr instanceof ToNumberExpr) {
      this.#validateExprContainer(expr.expression)
    } else if (expr instanceof ToBooleanExpr) {
      this.#validateExprContainer(expr.expression)
    } else if (expr instanceof LogicalExpr) {
      this.#validateExprContainer(expr.left)
      this.#validateExprContainer(expr.right)
    }
  }
}
