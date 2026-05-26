import { AssignExpr } from '../blocks/expressions/classes/variables/assign'
import { AssignOpExpr } from '../blocks/expressions/classes/variables/assign-op'
import { IncrementExpr } from '../blocks/expressions/classes/variables/increment'
import type { Expr } from '../blocks/expressions'
import { BinaryExpr } from '../blocks/expressions/classes/operaciones/binary'
import { BinaryCompExpr } from '../blocks/expressions/classes/operaciones/binary-comp'
import { ConcatExpr } from '../blocks/expressions/classes/conversion/concat'
import { LogicalExpr } from '../blocks/expressions/classes/operaciones/logical'
import { ToNumberExpr } from '../blocks/expressions/classes/conversion/to-number'
import { ToBooleanExpr } from '../blocks/expressions/classes/conversion/to-boolean'
import { VariableExpr } from '../blocks/expressions/classes/variables/variable'
import { ReadExpr } from '../blocks/expressions/classes/valores/read'
import type { ExprStmt, Stmt } from '../blocks/statements'
import type { PrintStmt } from '../blocks/statements/classes/print-stmt'
import { VariableStmt } from '../blocks/statements/classes/variable-stmt'
import { IfStmt, ElseIfStmt, ElseStmt, WhileStmt, DoWhileStmt, ForStmt } from '../blocks/statements'
import {
  error,
  ErrorType,
  type ErrorInfo,
  type EvalError,
  type Location,
} from '../errors'
import { BlockStmt } from '../blocks/statements/classes/block-stmt'
import { Defineds } from './defineds'
import { PrimaryType } from '../types'
import { statementsLabels } from '../blocks/statements/records/labels'

export function validate(
  statements: Stmt[],
  definedsParent?: Defineds,
  ...parents: Location[]
): EvalError[] {
  const errors: EvalError[] = []
  const defineds = new Defineds(definedsParent)

  const addError = (type: ErrorType, msg: string, ...locations: Location[]) => {
    errors.push(error(type, msg, ...parents, ...locations))
  }
  const addErrorInfo = (
    err: ErrorInfo | undefined,
    ...locations: Location[]
  ) => {
    if (err == null) return
    addError(err.type, err.message, ...locations)
  }

  const createTools = (...locations: Location[]) => {
    return {
      addError: (type: ErrorType, msg: string) =>
        addError(type, msg, ...locations),
      addErrorInfo: (err: ErrorInfo | undefined) => {
        addErrorInfo(err, ...locations)
      },
    }
  }

  for (let i = 0; i < statements.length; i++) {
    const index = i
    const stmt = statements[i]
    const location = { index, stmt: stmt.name }

    if (stmt instanceof BlockStmt) {
      errors.push(...validate(stmt.children, defineds, ...parents, location))
    } else if (stmt instanceof VariableStmt) {
      if (stmt.identifier === '') {
        addError(
          ErrorType.MissingIdentifier,
          `Las variables deben tener un identificador`,
          location,
        )
      } else {
        addErrorInfo(
          defineds.define(stmt.identifier, stmt.expression.type),
          location,
        )
      }

      collectExprErrors(stmt.expression, defineds, createTools(location))
    } else if (stmt.name === 'print-stmt') {
      collectExprErrors(
        (stmt as PrintStmt).expression,
        defineds,
        createTools(location),
      )
    } else if (stmt.name === 'expr-stmt') {
      collectExprErrors(
        (stmt as ExprStmt).expression,
        defineds,
        createTools(location),
      )
    } else if (stmt instanceof IfStmt) {
      collectExprErrors(stmt.condition, defineds, createTools(location))
      if (stmt.condition.type !== PrimaryType.boolean) {
        addError(
          ErrorType.Type,
          `La condición debe ser V / F, recibió ${stmt.condition.type}`,
          location,
        )
      }
      errors.push(
        ...validate(stmt.thenBody.children, defineds, ...parents, location),
      )

      while (statements[i + 1] instanceof ElseIfStmt) {
        const stmt = statements[++i] as ElseIfStmt
        const elseLoc = { index: i, stmt: stmt.name }
        collectExprErrors(
          stmt.condition,
          defineds,
          createTools(...parents, location, elseLoc),
        )
        if (stmt.condition.type !== PrimaryType.boolean) {
          addError(
            ErrorType.Type,
            `La condición debe ser V / F, recibió ${stmt.condition.type}`,
            location,
            elseLoc,
          )
        }
        errors.push(
          ...validate(
            stmt.body.children,
            defineds,
            ...parents,
            location,
            elseLoc,
          ),
        )

        if (statements[i + 1] instanceof ElseStmt) {
          const elseStmt = statements[++i] as ElseStmt
          const elseLoc = { index: i, stmt: elseStmt.name }
          errors.push(
            ...validate(
              elseStmt.body.children,
              defineds,
              ...parents,
              location,
              elseLoc,
            ),
          )
          break
        }
      }
    } else if (stmt instanceof ElseIfStmt || stmt instanceof ElseStmt) {
      addError(
        ErrorType.InvalidStatement,
        `Un '${statementsLabels[stmt.name]}' solo puede ir después de un '${statementsLabels['if-stmt']}' o un '${statementsLabels['else-if-stmt']}'`,
        location,
      )
    } else if (stmt instanceof WhileStmt) {
      collectExprErrors(stmt.condition, defineds, createTools(location))
      if (stmt.condition.type !== PrimaryType.boolean) {
        addError(
          ErrorType.Type,
          `La condición debe ser V / F, recibió ${stmt.condition.type}`,
          location,
        )
      }
      errors.push(
        ...validate(stmt.body.children, defineds, ...parents, location),
      )
    } else if (stmt instanceof DoWhileStmt) {
      collectExprErrors(stmt.condition, defineds, createTools(location))
      if (stmt.condition.type !== PrimaryType.boolean) {
        addError(
          ErrorType.Type,
          `La condición debe ser V / F, recibió ${stmt.condition.type}`,
          location,
        )
      }
      errors.push(
        ...validate(stmt.body.children, defineds, ...parents, location),
      )
    } else if (stmt instanceof ForStmt) {
      if (stmt.identifier === '') {
        addError(
          ErrorType.MissingIdentifier,
          `El bucle debe tener una variable`,
          location,
        )
      }
      collectExprErrors(stmt.start, defineds, createTools(location))
      collectExprErrors(stmt.end, defineds, createTools(location))
      collectExprErrors(stmt.step, defineds, createTools(location))
      if (stmt.start.type !== PrimaryType.number) {
        addError(
          ErrorType.Type,
          `El valor inicial debe ser número, recibió ${stmt.start.type}`,
          location,
        )
      }
      if (stmt.end.type !== PrimaryType.number) {
        addError(
          ErrorType.Type,
          `El valor final debe ser número, recibió ${stmt.end.type}`,
          location,
        )
      }
      if (stmt.step.type !== PrimaryType.number) {
        addError(
          ErrorType.Type,
          `El paso debe ser número, recibió ${stmt.step.type}`,
          location,
        )
      }
      const forDefineds = new Defineds(defineds)
      if (stmt.identifier !== '') {
        forDefineds.define(stmt.identifier, PrimaryType.number)
      }
      errors.push(
        ...validate(stmt.body.children, forDefineds, ...parents, location),
      )
    }
  }

  return errors
}

function collectExprErrors(
  expr: Expr,
  defineds: Defineds,
  tools: {
    addError: (type: ErrorType, msg: string) => void
    addErrorInfo: (err: ErrorInfo | undefined) => void
  },
) {
  const collect = (expr: Expr) => {
    collectExprErrors(expr, defineds, tools)
  }

  if (expr instanceof BinaryExpr) {
    collect(expr.left)
    collect(expr.right)

    const leftType = expr.left.type
    const rightType = expr.right.type

    if (leftType !== PrimaryType.number || rightType !== PrimaryType.number) {
      tools.addError(
        ErrorType.Type,
        `La operación aritmética requiere números, recibió ${leftType} y ${rightType}`,
      )
    }
  } else if (expr instanceof BinaryCompExpr) {
    collect(expr.left)
    collect(expr.right)

    const leftType = expr.left.type
    const rightType = expr.right.type

    if (expr.operator !== '==' && expr.operator !== '!=') {
      if (leftType !== PrimaryType.number || rightType !== PrimaryType.number) {
        tools.addError(
          ErrorType.Type,
          `La comparación requiere números, recibió ${leftType} y ${rightType}`,
        )
      }
    } else {
      if (leftType !== rightType) {
        tools.addError(
          ErrorType.Type,
          `La comparación entre dos tipos diferentes es siempre falsa.`,
        )
      }
    }
  } else if (expr instanceof VariableExpr) {
    tools.addErrorInfo(defineds.get(expr.identifier))
  } else if (expr instanceof AssignExpr) {
    collect(expr.expression)
    tools.addErrorInfo(defineds.assing(expr.identifier, expr.expression.type))
  } else if (expr instanceof AssignOpExpr) {
    collect(expr.expression)
    tools.addErrorInfo(defineds.assing(expr.identifier, PrimaryType.number))
    if (expr.expression.type !== PrimaryType.number) {
      tools.addError(
        ErrorType.Type,
        `La operación '${expr.operator}' requiere un número, recibió ${expr.expression.type}`,
      )
    }
  } else if (expr instanceof IncrementExpr) {
    tools.addErrorInfo(defineds.assing(expr.identifier, PrimaryType.number))
  } else if (expr instanceof ConcatExpr) {
    collect(expr.left)
    collect(expr.right)

    if (expr.left.type !== PrimaryType.string) {
      tools.addError(
        ErrorType.Type,
        `La concatenación requiere texto en ambos lados, recibió ${expr.left.type} a la izquierda`,
      )
    }
    if (expr.right.type !== PrimaryType.string) {
      tools.addError(
        ErrorType.Type,
        `La concatenación requiere texto en ambos lados, recibió ${expr.right.type} a la derecha`,
      )
    }
  } else if (expr instanceof ReadExpr) {
    collect(expr.prompt)
    const promptType = expr.prompt.type
    if (promptType !== PrimaryType.string) {
      tools.addError(
        ErrorType.Type,
        `El mensaje de lectura debe ser texto, recibió ${promptType}`,
      )
    }
  } else if (expr instanceof ToNumberExpr) {
    collect(expr.expression)
    if (expr.expression.type !== PrimaryType.string) {
      tools.addError(
        ErrorType.Type,
        `La conversión a número requiere texto, recibió ${expr.expression.type}`,
      )
    }
  } else if (expr instanceof ToBooleanExpr) {
    collect(expr.expression)
    if (expr.expression.type !== PrimaryType.string) {
      tools.addError(
        ErrorType.Type,
        `La conversión a booleano requiere texto, recibió ${expr.expression.type}`,
      )
    }
  } else if (expr instanceof LogicalExpr) {
    collect(expr.left)
    collect(expr.right)

    if (expr.left.type !== PrimaryType.boolean) {
      tools.addError(
        ErrorType.Type,
        `La operación lógica requiere valores V / F, recibió ${expr.left.type} a la izquierda`,
      )
    }
    if (expr.right.type !== PrimaryType.boolean) {
      tools.addError(
        ErrorType.Type,
        `La operación lógica requiere valores V / F, recibió ${expr.right.type} a la derecha`,
      )
    }
  }
}
