import type { Statements } from '../enum'

export const statementsLabels: Record<Statements, string> = {
  stmt: 'Bloque sin utilidad',
  'expr-stmt': 'Evaluar expresión',
  'print-stmt': 'Mostrar en consola',
  'variable-stmt': 'Declarar variable',
  'block-stmt': 'Bloque de código',
  'if-stmt': 'Si',
  'else-if-stmt': 'O si',
  'else-stmt': 'Si no',
  'while-stmt': 'Mientras',
  'do-while-stmt': 'Hacer mientras',
  'for-stmt': 'Para',
  'wait-stmt': 'Esperar',
}
