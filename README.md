# BlockScript

Editor visual de programación por bloques construido con React 19, TypeScript 6, Vite 8 y TailwindCSS 4.

## Stack

- **React 19** — UI
- **TypeScript 6** — tipado
- **Vite 8** — build tool
- **TailwindCSS 4** — estilos
- **Zustand 5** — solo sidebar
- **@tabler/icons-react** — iconos

## Comandos

```bash
pnpm dev       # servidor de desarrollo
pnpm build     # tsc -b && vite build
pnpm lint      # eslint
pnpm preview   # preview de producción
```

## Arquitectura

El editor se organiza en dos categorías principales:

### Statements (11)
Sentencias de control de flujo: If/ElseIf/Else, While, DoWhile, For, Print, Variable, Expr, Block. Usan indices path-based para CRUD (`addAt`, `removeAt`, `replaceAt`, `move`, `updateAt`).

### Expressions (16)
Valores, operaciones aritméticas, comparaciones, lógica, variables, asignaciones, conversión de tipos y entrada. Organizadas en subdirectorios por grupo (`valores/`, `operaciones/`, `variables/`, `conversion/`).

### Grupos de sidebar

| Grupo (expresiones) | Color |
|---|---|
| Valores | amber |
| Operaciones | red |
| Variables | purple |
| Conversión | orange |

| Grupo (statements) | Color |
|---|---|
| Expresiones | sky |
| Variables | cyan |
| Salida | green |
| Condicionales | rose |
| Bucles | amber |

### Validación e interpretación

- **Validator**: scoping padre-hijo con `Defineds`. Soporta todos los tipos de statement y expresión con chequeo de tipos.
- **Interpreter**: evalúa dinámicamente usando `peek()`/`next()` para condicionales encadenados (sibling pattern).

### Persistencia

- Auto-guarda en `localStorage` cada 5 segundos y al ejecutar
- Exportar/Importar archivos `.bs`
- Serialización genérica via `serialize()`/`deserialize()`
