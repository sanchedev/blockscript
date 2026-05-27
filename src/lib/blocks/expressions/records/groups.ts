import { Expressions } from '../enum'
import {
  IconNumber,
  IconMath,
  IconVariable,
  IconArrowsLeftRight,
} from '@tabler/icons-react'
import type { GroupConfig } from '../../shared/group-types'

export enum ExpressionsGroupKey {
  Valores = 'valores',
  Operaciones = 'operaciones',
  Variables = 'variables',
  Conversion = 'conversion',
}

export const expressionsGroups: Record<ExpressionsGroupKey, GroupConfig<Expressions>> = {
  [ExpressionsGroupKey.Valores]: {
    title: 'Valores',
    items: [
      Expressions.StringLiteral,
      Expressions.NumberLiteral,
      Expressions.BooleanLiteral,
      Expressions.NullLiteral,
      Expressions.Read,
    ],
    blockColor: 'sky',
    sectionColor: 'amber',
    icon: IconNumber,
  },
  [ExpressionsGroupKey.Operaciones]: {
    title: 'Operaciones',
    items: [
      Expressions.Binary,
      Expressions.BinaryComp,
      Expressions.Logical,
    ],
    blockColor: 'sky',
    sectionColor: 'red',
    icon: IconMath,
  },
  [ExpressionsGroupKey.Variables]: {
    title: 'Variables',
    items: [
      Expressions.Variable,
      Expressions.Assign,
      Expressions.AssignOp,
      Expressions.Increment,
    ],
    blockColor: 'sky',
    sectionColor: 'purple',
    icon: IconVariable,
  },
  [ExpressionsGroupKey.Conversion]: {
    title: 'Conversión',
    items: [
      Expressions.ToString,
      Expressions.ToNumber,
      Expressions.ToBoolean,
      Expressions.Concat,
    ],
    blockColor: 'sky',
    sectionColor: 'orange',
    icon: IconArrowsLeftRight,
  },
}
