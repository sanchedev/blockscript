import { Statements } from '../enum'
import {
  IconClock,
  IconCode,
  IconVariable,
  IconPrinter,
  IconGitBranch,
  IconRepeat,
} from '@tabler/icons-react'
import type { GroupConfig } from '../../shared/group-types'
import { blockStyles } from '../../../theme'

export enum StatementsGroupKey {
  Expresiones = 'expresiones',
  Variables = 'variables',
  Salida = 'salida',
  Condicionales = 'condicionales',
  Bucles = 'bucles',
  Tiempo = 'tiempo',
}

export const statementsGroups: Record<
  StatementsGroupKey,
  GroupConfig<Statements>
> = {
  [StatementsGroupKey.Expresiones]: {
    title: 'Expresiones',
    items: [Statements.Expr],
    blockColor: 'sky',
    sectionColor: 'blue',
    icon: IconCode,
  },
  [StatementsGroupKey.Variables]: {
    title: 'Variables',
    items: [Statements.Variable],
    blockColor: 'cyan',
    sectionColor: 'cyan',
    icon: IconVariable,
  },
  [StatementsGroupKey.Salida]: {
    title: 'Salida',
    items: [Statements.Print],
    blockColor: 'green',
    sectionColor: 'green',
    icon: IconPrinter,
  },
  [StatementsGroupKey.Condicionales]: {
    title: 'Condicionales',
    items: [Statements.If, Statements.ElseIf, Statements.Else],
    blockColor: 'rose',
    sectionColor: 'rose',
    icon: IconGitBranch,
  },
  [StatementsGroupKey.Bucles]: {
    title: 'Bucles',
    items: [Statements.While, Statements.DoWhile, Statements.For],
    blockColor: 'amber',
    sectionColor: 'amber',
    icon: IconRepeat,
  },
  [StatementsGroupKey.Tiempo]: {
    title: 'Tiempo',
    items: [Statements.Wait],
    blockColor: 'yellow',
    sectionColor: 'yellow',
    icon: IconClock,
  },
}

export function getStmtGroupKey(stmt: Statements): StatementsGroupKey {
  const entry = Object.entries(statementsGroups).find(([, group]) =>
    group.items.includes(stmt),
  )
  return (entry?.[0] ?? StatementsGroupKey.Expresiones) as StatementsGroupKey
}
export function getStmtGroupColor(stmt: Statements) {
  const group = statementsGroups[getStmtGroupKey(stmt)]
  return blockStyles(group.blockColor)
}

export type { GroupConfig }
