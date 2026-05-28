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
| Estado | Zustand 5 (solo sidebar) + Context (stmt/error/output/location) |
| Zoom/Pan | react-zoom-pan-pinch |
| Iconos | @tabler/icons-react |
| Utilidades | clsx |

## Statements (11)

| Clase | name | Props |
|---|---|---|
| `BlockStmt` | `block-stmt` | `children: Stmt[]` |
| `ExprStmt` | `expr-stmt` | `expression: Expr` |
| `PrintStmt` | `print-stmt` | `expression: Expr` |
| `VariableStmt` | `variable-stmt` | `identifier, expression: Expr` |
| `IfStmt` | `if-stmt` | `condition: Expr, thenBody: BlockStmt` |
| `ElseIfStmt` | `else-if-stmt` | `condition: Expr, body: BlockStmt` |
| `ElseStmt` | `else-stmt` | `body: BlockStmt` |
| `WhileStmt` | `while-stmt` | `condition: Expr, body: BlockStmt` |
| `DoWhileStmt` | `do-while-stmt` | `condition: Expr, body: BlockStmt` |
| `ForStmt` | `for-stmt` | `identifier, start, end, step: Expr, body: BlockStmt` |

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

## Arquitectura

- **Entrypoint**: `src/main.tsx` → `App.tsx` → `Header` + `Entry` (zoom/pan via react-zoom-pan-pinch) + `Sidebar` + `Console`
- **State**: `GlobalStmtCtx` + `ErrorCtx` + `OutputCtx` + `LocationCtx` (context). Zustand solo para sidebar.
- **CRUD**: path de índices en `BlockStmt.children` (`addAt`, `removeAt`, `replaceAt`, `move`, `updateAt`). `useGlobalStmt` resuelve path desde `LocationCtx`.
- **Condicionales (sibling pattern)**: `IfStmt`, `ElseIfStmt`, `ElseStmt` viven como hermanos en `children[]`, no como linked list. Validador e intérprete usan `peek()`/`next()` para recorrerlos.
- **Interpreter**: `executeStatements()` con `peek()`/`next()` dinámicos. Bucles limitados a 65536 iteraciones. Step negativo soportado en `ForStmt`.
- **Validator**: `Defineds` class con scoping padre-hijo. Recorre recursivamente con soporte para `BlockStmt` anidados.
- **Sidebar**: event-driven request/response vía `useSidebarStore.send()`. Secciones construidas desde `statementsGroups`/`expressionsGroups` con colores por grupo.
- **Eventos**: pub/sub con `Event<T>` (`editorChanged`, `sidebarInfoRecieved`, `sidebarInfoSended`).
- **Persistencia**: autosave a `localStorage` (`blockscript-save`) cada 5s con debounce. Export/import `.bs` via `serialize()`/`deserialize()`.

## Agregar una expresión

1. `expressions/enum.ts` → agregar al enum
2. `expressions/classes/<grupo>/<name>.ts` → clase (`edit()`, `copy()`, `migrateFrom()`, `type`)
3. `expressions/classes/index.ts` → export
4. `expressions/records/classes.ts`, `labels.ts`, `groups.ts`
5. `components/blocks/expressions/<grupo>/<name>.tsx` → componente
6. `components/blocks/expressions/expr.tsx` → dispatch `instanceof`
7. `validator/validator.ts` → `collectExprErrors` + validación de tipo
8. `interpreter.ts` → `evaluate()`

## SEO & PWA

Meta tags, Open Graph, Twitter Cards, JSON-LD estructurado, fuente Cascadia Code (Google Fonts).  
`robots.txt`, `sitemap.xml`, `manifest.json` (standalone PWA), `favicon.ico`, `og-image.png`.
