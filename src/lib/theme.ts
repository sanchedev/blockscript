export const blockColorMap = {
  sky:    { bg: 'bg-sky-200',    text: 'text-sky-900',    border: 'border-sky-400',    ring: 'ring-sky-500' },
  cyan:   { bg: 'bg-cyan-200',   text: 'text-cyan-900',   border: 'border-cyan-400',   ring: 'ring-cyan-500' },
  green:  { bg: 'bg-green-200',  text: 'text-green-900',  border: 'border-green-400',  ring: 'ring-green-500' },
  rose:   { bg: 'bg-rose-200',   text: 'text-rose-900',   border: 'border-rose-400',   ring: 'ring-rose-500' },
  amber:  { bg: 'bg-amber-200',  text: 'text-amber-900',  border: 'border-amber-400',  ring: 'ring-amber-500' },
  yellow: { bg: 'bg-yellow-200', text: 'text-yellow-900', border: 'border-yellow-400', ring: 'ring-yellow-500' },
} as const

export const sectionColorMap = {
  sky:    { bg: 'bg-sky-100',    text: 'text-sky-800',    border: 'border-sky-300',    ring: 'ring-sky-400' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   ring: 'ring-blue-400' },
  cyan:   { bg: 'bg-cyan-100',   text: 'text-cyan-800',   border: 'border-cyan-300',   ring: 'ring-cyan-400' },
  green:  { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  ring: 'ring-green-400' },
  rose:   { bg: 'bg-rose-100',   text: 'text-rose-800',   border: 'border-rose-300',   ring: 'ring-rose-400' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300',  ring: 'ring-amber-400' },
  red:    { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    ring: 'ring-red-400' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', ring: 'ring-orange-400' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', ring: 'ring-purple-400' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', ring: 'ring-yellow-400' },
} as const

export type BlockThemeColor = keyof typeof blockColorMap
export type SectionThemeColor = keyof typeof sectionColorMap

export function blockStyles(color: BlockThemeColor) {
  return blockColorMap[color]
}
