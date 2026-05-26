import { PrimaryType } from './types'

export const typeStyles: Record<
  PrimaryType,
  { bg: string; text: string; border: string; ring: string }
> = {
  [PrimaryType.number]: {
    bg: 'bg-red-300',
    text: 'text-red-800',
    border: 'border-red-500',
    ring: 'ring-red-400',
  },
  [PrimaryType.string]: {
    bg: 'bg-lime-300',
    text: 'text-lime-800',
    border: 'border-lime-500',
    ring: 'ring-lime-400',
  },
  [PrimaryType.boolean]: {
    bg: 'bg-purple-300',
    text: 'text-purple-800',
    border: 'border-purple-500',
    ring: 'ring-purple-400',
  },
  [PrimaryType.null]: {
    bg: 'bg-amber-300',
    text: 'text-amber-800',
    border: 'border-amber-500',
    ring: 'ring-amber-400',
  },
}
