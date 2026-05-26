export const sectionStyles = {
  expresiones: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    ring: 'ring-blue-400',
    header: 'bg-blue-200 text-blue-900',
  },
  variables: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-300',
    ring: 'ring-cyan-400',
    header: 'bg-cyan-200 text-cyan-900',
  },
  salida: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    ring: 'ring-green-400',
    header: 'bg-green-200 text-green-900',
  },
  condicionales: {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-300',
    ring: 'ring-rose-400',
    header: 'bg-rose-200 text-rose-900',
  },
  bucles: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    header: 'bg-amber-200 text-amber-900',
  },
} as const

export type SectionKey = keyof typeof sectionStyles
