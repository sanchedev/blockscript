import type { Expressions } from '../enum'

export const expressionsLabels: Record<Expressions, string> = {
  expr: 'Expresión',
  'string-expr': 'Texto',
  'null-literal': 'Nulo',
  'number-expr': 'Número',
  'boolean-expr': 'Verdadero/Falso',
  'binary-expr': 'Aritmética',
  'binary-comp-expr': 'Comparación',
  'variable-expr': 'Referencia a variable',
  'assign-expr': 'Asignación',
  'read-expr': 'Leer de consola',
  'concat-expr': 'Concatenar',
  'to-string-expr': 'Convertir a texto',
  'to-number-expr': 'Convertir a número',
  'to-boolean-expr': 'Convertir a booleano',
  'logical-expr': 'Y / O',
  'assign-op-expr': 'Asignación compuesta',
  'increment-expr': 'Incrementar / Decrementar',
}
