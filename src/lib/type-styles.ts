import { PrimaryType } from './types'

const typeColorMap = {
  [PrimaryType.number]: {
    bg: 'bg-red-200',
    text: 'text-red-800',
    border: 'border-red-400',
    ring: 'ring-red-300',
  },
  [PrimaryType.string]: {
    bg: 'bg-lime-200',
    text: 'text-lime-800',
    border: 'border-lime-400',
    ring: 'ring-lime-400',
  },
  [PrimaryType.boolean]: {
    bg: 'bg-purple-200',
    text: 'text-purple-800',
    border: 'border-purple-400',
    ring: 'ring-purple-300',
  },
  [PrimaryType.null]: {
    bg: 'bg-amber-200',
    text: 'text-amber-800',
    border: 'border-amber-400',
    ring: 'ring-amber-300',
  },
} as const

export function typeStyles(type: PrimaryType) {
  return typeColorMap[type]
}
