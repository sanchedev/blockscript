import { ErrorType, type ErrorInfo } from '../errors'
import type { Type } from '../types'

export interface ExportedDefineds {
  vars: Map<string, VariableInfo>
  parent?: ExportedDefineds
  children: ExportedDefineds[]
}

interface VariableInfo {
  type: Type
  path: number[]
}

export class Defineds {
  constructor(public parent?: Defineds) {
    parent?._children.push(this)
  }

  #definedVars = new Map<string, VariableInfo>()

  _children: Defineds[] = []

  _getAbsolute(identifier: string): Type | undefined {
    return (
      this.#definedVars.get(identifier)?.type ??
      this.parent?._getAbsolute(identifier)
    )
  }

  define(
    identifier: string,
    type: Type,
    path: number[],
  ): ErrorInfo | undefined {
    if (this.#definedVars.has(identifier)) {
      return {
        type: ErrorType.DuplicateVariable,
        message: `La variable '${identifier}' ya fue declarada`,
      }
    }
    this.#definedVars.set(identifier, { type, path })
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

  addChild(defineds: Defineds) {
    this._children.push(defineds)
  }

  export(): ExportedDefineds {
    const def: ExportedDefineds = {
      vars: this.#definedVars,
      children: [],
    }
    def.children = this._children.map((d) => ({ ...d.export(), parent: def }))

    return def
  }
}
