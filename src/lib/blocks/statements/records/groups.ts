import { Statements } from '../enum'
import {
  IconCode,
  IconVariable,
  IconPrinter,
  IconGitBranch,
  IconRepeat,
} from '@tabler/icons-react'
import type { GroupConfig } from '../../shared/group-types'

export enum StatementsGroupKey {
  Expresiones = 'expresiones',
  Variables = 'variables',
  Salida = 'salida',
  Condicionales = 'condicionales',
  Bucles = 'bucles',
}

export const statementsGroups: Record<StatementsGroupKey, GroupConfig<Statements>> = {
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
}

export function getStmtGroupKey(stmt: Statements): StatementsGroupKey {
  const entry = Object.entries(statementsGroups).find(([, group]) =>
    group.items.includes(stmt),
  )
  return (entry?.[0] ?? StatementsGroupKey.Expresiones) as StatementsGroupKey
}

export type { GroupConfig }
