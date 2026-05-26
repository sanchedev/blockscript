export const sectionStyles = {
  valores: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    header: 'bg-amber-200 text-amber-900',
  },
  operaciones: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    ring: 'ring-red-400',
    header: 'bg-red-200 text-red-900',
  },
  variables: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    ring: 'ring-purple-400',
    header: 'bg-purple-200 text-purple-900',
  },
  conversion: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    ring: 'ring-orange-400',
    header: 'bg-orange-200 text-orange-900',
  },
} as const

export type SectionKey = keyof typeof sectionStyles
