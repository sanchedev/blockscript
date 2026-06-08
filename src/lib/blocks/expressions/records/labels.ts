import type { Expressions } from '../enum'

export const expressionsLabels: Record<Expressions, string> = {
  expr: 'Expresión',
  'string-expr': 'Texto',
  'null-literal': 'Nulo',
  'number-expr': 'Número',
  'boolean-expr': 'Booleano',
  'binary-expr': 'Aritmética',
  'binary-comp-expr': 'Comparación',
  'variable-expr': 'Variable',
  'assign-expr': 'Asignación',
  'read-expr': 'Lectura',
  'concat-expr': 'Concatenación',
  'to-string-expr': 'A texto',
  'to-number-expr': 'A número',
  'to-boolean-expr': 'A booleano',
  'logical-expr': 'Lógico',
  'assign-op-expr': 'Asign. compuesta',
  'increment-expr': 'Incremento',
}
