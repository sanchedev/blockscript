import type { Statements } from '../enum'

export const statementsLabels: Record<Statements, string> = {
  stmt: 'Sentencia',
  'expr-stmt': 'Expresión',
  'print-stmt': 'Impresión',
  'variable-stmt': 'Variable',
  'block-stmt': 'Bloque',
  'if-stmt': 'Si',
  'else-if-stmt': 'O si',
  'else-stmt': 'Si no',
  'while-stmt': 'Mientras',
  'do-while-stmt': 'Hacer mientras',
  'for-stmt': 'Para',
  'wait-stmt': 'Espera',
  'break-stmt': 'Romper',
  'continue-stmt': 'Continuar',
}
