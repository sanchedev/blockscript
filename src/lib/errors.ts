import type { Statements } from './blocks/statements/enum'

export enum ErrorType {
  Type = 'Error de Tipo',
  Required = 'Expresión Requerida',
  UndefinedVariable = 'Variable no definida',
  DuplicateVariable = 'Variable duplicada',
  MissingIdentifier = 'Identificador faltante',
  InvalidStatement = 'Sentencia inválida',
  Runtime = 'Error en ejecución',
}

export interface ErrorInfo {
  type: ErrorType
  message: string
}

export interface EvalError extends ErrorInfo {
  location: Location[]
}

export interface Location {
  index: number
  stmt: Statements
}

export function error(
  type: ErrorType,
  message: string,
  ...location: Location[]
): EvalError {
  return {
    type,
    message,
    location,
  }
}
