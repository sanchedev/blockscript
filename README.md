# BlockScript

**Editor visual de programación por bloques.**  
React 19 · TypeScript 6 · Vite 8 · TailwindCSS 4 · Zustand 5

<p align="center">
  <a href="https://blockscript-mu.vercel.app" target="_blank">
    <img src="public/og-image.png" alt="BlockScript screenshot" width="600" />
  </a>
  <br />
  <a href="https://blockscript-mu.vercel.app">blockscript-mu.vercel.app →</a>
</p>

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc -b && vite build
pnpm lint       # eslint
pnpm preview    # vite preview
```

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + React Compiler (experimental) |
| Lenguaje | TypeScript 6 |
| Build | Vite 8 + Rolldown |
| Estilos | TailwindCSS 4 + tailwind-animations |
| Estado | Zustand 5 (root-stmt, drag, menu, console) + Context (error, output) |
| Zoom/Pan | react-zoom-pan-pinch |
| Iconos | @tabler/icons-react |
| Serialización | Zod |
| Utilidades | clsx |

## Statements (11)

| Clase | name | Props |
|---|---|---|
| `BlockStmt` | `block-stmt` | `children: Stmt[]` |
| `ExprStmt` | `expr-stmt` | `expression: ExprContainer` |
| `PrintStmt` | `print-stmt` | `expression: ExprContainer` |
| `VariableStmt` | `variable-stmt` | `identifier, expression: ExprContainer` |
| `IfStmt` | `if-stmt` | `condition: ExprContainer, thenBody: BlockStmt` |
| `ElseIfStmt` | `else-if-stmt` | `condition: ExprContainer, body: BlockStmt` |
| `ElseStmt` | `else-stmt` | `body: BlockStmt` |
| `WhileStmt` | `while-stmt` | `condition: ExprContainer, body: BlockStmt` |
| `DoWhileStmt` | `do-while-stmt` | `condition: ExprContainer, body: BlockStmt` |
| `ForStmt` | `for-stmt` | `identifier, start, end, step: ExprContainer, body: BlockStmt` |
| `WaitStmt` | `wait-stmt` | `duration: ExprContainer` |

## Expressions (16)

| Clase | name | type |
|---|---|---|
| `NumberLiteralExpr` | `number-expr` | número |
| `StringLiteralExpr` | `string-expr` | texto |
| `BooleanLiteralExpr` | `boolean-expr` | V / F |
| `NullLiteralExpr` | `null-literal` | nulo |
| `BinaryExpr` | `binary-expr` | número |
| `BinaryCompExpr` | `binary-comp-expr` | V / F |
| `ConcatExpr` | `concat-expr` | texto |
| `ToStringExpr` | `to-string-expr` | texto |
| `ToNumberExpr` | `to-number-expr` | número |
| `ToBooleanExpr` | `to-boolean-expr` | V / F |
| `LogicalExpr` | `logical-expr` | V / F |
| `VariableExpr` | `variable-expr` | según variable |
| `AssignExpr` | `assign-expr` | según expresión |
| `AssignOpExpr` | `assign-op-expr` | número |
| `IncrementExpr` | `increment-expr` | número |
| `ReadExpr` | `read-expr` | texto |

**Operadores:** `+`, `-`, `*`, `/`, `%` · `>`, `<`, `>=`, `<=`, `==`, `!=` · `Y`, `O` · `+=`, `-=`, `*=`, `/=` · `++`, `--`

## Validación

| Expresión | Regla |
|---|---|
| BinaryExpr | ambos operandos número |
| BinaryCompExpr (`==`/`!=`) | tipos deben coincidir |
| BinaryCompExpr (otros) | ambos número |
| ConcatExpr | ambos texto |
| LogicalExpr | ambos V / F |
| ReadExpr | prompt texto |
| VariableExpr | identifier existe en scope |
| AssignExpr | identifier existe, tipo coincide |

| Statement | Regla |
|---|---|
| VariableStmt | identifier no duplicado en el ámbito |
| IfStmt | condition V / F, camina hermanos ElseIf/Else |
| ElseIfStmt / ElseStmt huérfanos | `InvalidStatement` |
| WhileStmt / DoWhileStmt | condition V / F |
| ForStmt | start/end/step número; crea variable de loop scoped |

## Colores

| PrimaryType | Bg | Text |
|---|---|---|
| `número` | `bg-red-200` | `text-red-800` |
| `texto` | `bg-lime-200` | `text-lime-800` |
| `V / F` | `bg-purple-200` | `text-purple-800` |
| `nulo` | `bg-amber-200` | `text-amber-800` |

| Statement | Grupo | Bg |
|---|---|---|
| ExprStmt | Expresiones | `bg-sky-200` |
| VariableStmt | Variables | `bg-cyan-200` |
| PrintStmt | Salida | `bg-green-200` |
| IfStmt / ElseIfStmt / ElseStmt | Condicionales | `bg-rose-200` |
| WhileStmt / DoWhileStmt / ForStmt | Bucles | `bg-amber-200` |
| WaitStmt | Tiempo | `bg-yellow-200` |

## Arquitectura

- **Entrypoint**: `src/main.tsx` → `App.tsx` → `Header` + `Entry` (zoom/pan via react-zoom-pan-pinch) + `Menu` + `Console`
- **State**: `useRootStmt` (Zustand) como fuente de verdad del árbol. Cada `StmtComp`/`ExprComp` mantiene copia local vía `useState`. La mutación fluye: hijo → `triggerUpdate()` → `copy()` → `setState()` local. `BlockStmtCtx` provee `edit(index, stmt)` y `remove(index)`.
  - `StmtCtx` provee `{ parent, triggerUpdate }`
  - `ExprCtx` provee `{ parent, triggerUpdate }`
  - `ExprContainerCtx` provee `{ container, triggerUpdate }`
  - Error/Output vía `ErrorCtx` + `OutputCtx`
- **Drag & drop**: `drag-store` (Zustand) maneja el arrastre activo. `stmt-drags`/`expr-drags` almacenan items flotantes. El drag image nativo se oculta; un skeleton inline sigue al cursor. `BlockStmtComp` acepta drop de statements. `ExprContainerComp` acepta drop de expresiones con validación de tipo.
- **Menú**: reemplaza la sidebar anterior. Tabs de expresiones/declaraciones con search y skeletons visuales clickables. Al clickear, crea instancia via `ClassName.default` y la agrega como item flotante.
- **Condicionales (sibling pattern)**: `IfStmt`, `ElseIfStmt`, `ElseStmt` viven como hermanos en `children[]`. Validador e intérprete usan `peek()`/`next()` para recorrerlos.
- **Interpreter**: `executeStatements()` con `peek()`/`next()` dinámicos. Bucles limitados a 65536 iteraciones. Step negativo soportado en `ForStmt`. Todos los métodos async para evitar congelar la UI.
- **Validator**: `Defineds` class con scoping padre-hijo. Recorre recursivamente con soporte para `BlockStmt` anidados.
- **Serializer**: Zod `configSchema` + `createFrom(rawConfig)` + `export()` en cada clase. `Stmt.createFrom()`/`Expr.createFrom()` delegan por `name`. Persistencia: autosave a `localStorage` cada 5s con debounce. Export/import `.bs` via `exportToFile()`.
- **Eventos**: pub/sub con `Event<T>` (`editorChanged`).
- **Skeletons**: `ExprSkeleton`/`StmtSkeleton` — componentes read-only que renderizan la estructura visual completa. Usados en menú y como ghost drag. Colores derivados de `typeStyles()` / `blockColorMap`.
- **UI components**: `Button` con variants, `ResizeInput` (autoajuste de ancho), `VariableInput` con datalist para autocompletado.
- **IDs**: `crypto.randomUUID()` en constructor, preservado en `copy()`.

## Agregar una expresión

1. `expressions/enum.ts` → agregar al enum
2. `expressions/classes/<grupo>/<name>.ts` → clase (`static default`, `static configSchema`, `static createFrom`, `copy()`, `export()`, `edit()`, `type`)
3. `expressions/classes/index.ts` → export
4. `expressions/records/classes.ts`, `labels.ts`, `groups.ts`
5. `components/blocks/expressions/<grupo>/<name>.tsx` → componente
6. `components/blocks/expressions/expr.tsx` → dispatch `instanceof`
7. `components/blocks/ui/skeletons/expr-skeleton.tsx` → dispatch `instanceof`
8. `validator/validator.ts` → `collectExprErrors` + validación de tipo
9. `interpreter.ts` → `evaluate()`

## SEO & PWA

Meta tags, Open Graph, Twitter Cards, JSON-LD estructurado, fuente Cascadia Code (Google Fonts).  
`robots.txt`, `sitemap.xml`, `manifest.json` (standalone PWA), `favicon.ico`, `og-image.png`.
