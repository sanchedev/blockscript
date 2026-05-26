import { ErrorType, type ErrorInfo } from '../errors'
import type { Type } from '../types'

export class Defineds {
  constructor(public parent?: Defineds) {}

  #definedVars = new Map<string, Type>()

  _getAbsolute(identifier: string): Type | undefined {
    return (
      this.#definedVars.get(identifier) ?? this.parent?._getAbsolute(identifier)
    )
  }

  define(identifier: string, type: Type): ErrorInfo | undefined {
    if (this.#definedVars.has(identifier)) {
      return {
        type: ErrorType.DuplicateVariable,
        message: `La variable '${identifier}' ya fue declarada`,
      }
    }
    this.#definedVars.set(identifier, type)
  }

  assing(identifier: string, type: Type): ErrorInfo | undefined {
    const varType = this._getAbsolute(identifier)

    if (varType == null) {
      if (this.parent) return this.parent.assing(identifier, type)
      return {
        type: ErrorType.UndefinedVariable,
        message: `Variable no definida: '${identifier}'`,
      }
    }

    if (varType !== type) {
      return {
        type: ErrorType.Type,
        message: `El tipo ${type} no se puede asignar al tipo ${varType} en la variable '${identifier}'`,
      }
    }
  }

  get(identifier: string): ErrorInfo | undefined {
    if (this._getAbsolute(identifier) == null) {
      return {
        type: ErrorType.UndefinedVariable,
        message: `Variable no definida: '${identifier}'`,
      }
    }
  }
}
