import { useLocationPath } from '../contexts/location-path'
import { type Type } from '../lib/types'
import type { ExportedDefineds } from '../lib/validator/defineds'
import { useError } from './error'

export function useVariableIdentifiers() {
  const { defineds } = useError()
  const pathIndex = useLocationPath().map((l) => l.index)
  const path = pathIndex.slice(0, -1).join(',')

  const flat = (defineds: ExportedDefineds): ExportedDefineds['vars'][] => {
    return [defineds.vars, ...defineds.children.flatMap((d) => flat(d))]
  }
  const variables = flat(defineds)

  const identifiers: string[] = variables.reduce<string[]>((acc, vars) => {
    for (const [identifier, { path: varPathIndex }] of vars.entries()) {
      const varPath = varPathIndex.slice(0, -1).join(',')
      if (pathIndex.length > 0) {
        if (path === varPath && pathIndex.at(-1)! <= varPathIndex.at(-1)!)
          continue
        if (!path.startsWith(varPath)) continue
      }
      if (!acc.includes(identifier)) acc.push(identifier)
    }
    return acc
  }, [])

  return identifiers
}

export function useVariableType(): (identifier: string) => Type | undefined {
  const { defineds } = useError()
  const locationPath = useLocationPath()

  return (identifier: string) => {
    if (identifier === '') return

    let def: ExportedDefineds | undefined = defineds
    for (const { index } of locationPath.slice(0, -1)) {
      def = def?.children.find(
        (d) => d.vars.values().next().value?.path[0] === index,
      )
    }
    while (def != null) {
      const varInfo = def.vars.get(identifier)
      if (varInfo != null) return varInfo.type
      def = def.parent
    }
  }
}
