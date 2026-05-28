# BlockScript

Editor visual de programación por bloques. React 19 + TypeScript 6 + Vite 8 + TailwindCSS 4 + Zustand 5 (solo sidebar).

> **Sync:** Cada cambio importante en statements, expressions, validación, colores o arquitectura debe registrarse tanto en `README.md` (visión pública) como en `AGENTS.md` (referencia operativa). Mantener ambos sincronizados.

## Comandos

```
pnpm dev          # dev server
pnpm build        # tsc -b && vite build
pnpm lint         # eslint
pnpm preview      # vite preview
```

## Arquitectura

- **Statements** (`src/lib/blocks/statements/classes/`) — `Stmt` (abstract, `id: string`, `name: Statements`), `BlockStmt` (raíz con `children: Stmt[]`), `ExprStmt`, `PrintStmt`, `VariableStmt`, `IfStmt`, `ElseIfStmt`, `ElseStmt`, `WhileStmt`, `DoWhileStmt`, `ForStmt`
  - Registros en `records/`: `classes.ts`, `labels.ts`, `groups.ts`
  - Enum `Statements` incluye `Stmt`, `Expr`, `Print`, `Variable`, `Block`, `If`, `ElseIf`, `Else`, `While`, `DoWhile`, `For`
- **Expressions** (`src/lib/blocks/expressions/classes/`) — `Expr` (abstract, `type: PrimaryType`), más 16 clases concretas organizadas en subdirectorios por grupo:
  - `valores/`: NumberLiteralExpr, StringLiteralExpr, BooleanLiteralExpr, NullLiteralExpr, ReadExpr
  - `operaciones/`: BinaryExpr, BinaryCompExpr, LogicalExpr
  - `variables/`: VariableExpr, AssignExpr, AssignOpExpr, IncrementExpr
  - `conversion/`: ConcatExpr, ToStringExpr, ToNumberExpr, ToBooleanExpr
  - Registros en `records/`: `classes.ts`, `labels.ts`, `groups.ts`
  - Enum `Expressions` con 16 valores (incluye `AssignOp`, `Increment`, `ToNumber`, `ToBoolean`, `Logical`)
- **Componentes de expresiones** (`src/components/blocks/expressions/`) — mismo mirror de directorios que `classes/`:
  - `valores/`, `operaciones/`, `variables/`, `conversion/` con sus respectivos `.tsx`
- **State**: no hay stores Zustand (excepto `sidebar-store`). Statements vía `GlobalStmtCtx` (context) + `GlobalStmtProvider`. Errores vía `ErrorCtx` + `ErrorProvider`. Output vía `OutputCtx` + `OutputProvider`. Location vía `LocationCtx` anidado con `LocationProvider`.
- **CRUD de statements**: basado en path de índices (`addAt`, `removeAt`, `replaceAt`, `move`, `updateAt`, `replaceStmt`), no en líneas. Los paths recorren `BlockStmt.children`. El hook `useGlobalStmt` resuelve automáticamente el path desde `LocationCtx`. `replaceStmt(stmt)` reemplaza el árbol completo (usado por importar/nuevo).
- **Block add-on-hover**: cada statement en `BlockStmtComp` tiene un botón `+` (hover) que abre el sidebar picker para insertar un nuevo statement después del actual.
- **Entrypoint**: `src/main.tsx` → `App.tsx` → `Header` + `Entry` (editor con zoom/pan via `react-zoom-pan-pinch`) + `Sidebar` + `Console`
- **Tipos**: `PrimaryType` enum con `número`, `texto`, `V / F`, `nulo`. `Expr.type` se asigna estáticamente en cada clase.
- **Validator** (`src/lib/validator/validator.ts` + `defineds.ts`): `Defineds` class con scoping padre-hijo (soporta `BlockStmt` anidados). `validate()` recorre recursivamente, incluyendo hijos de `BlockStmt`.
  - IfStmt: valida `condition` tipo `V / F`, valida `thenBody` recursivamente, luego camina hermanos `ElseIfStmt`/`ElseStmt` con `statements[i + 1]`.
  - ElseIfStmt/ElseStmt huérfanos (sin IfStmt previo) → `ErrorType.InvalidStatement`.
  - WhileStmt: valida `condition` tipo `V / F`, valida `body` recursivamente.
  - DoWhileStmt: same as WhileStmt.
  - ForStmt: valida `start`, `end`, `step` como `número`; crea `Defineds` hijo con loop variable; valida `body` recursivamente.
- **Interpreter** (`src/lib/interpreter.ts`): `executeStatements()` usa `peek()`/`next()` dinámicos. `executeIfStmt()` evalúa condición, ejecuta `thenBody`, luego recorre hermanos `ElseIfStmt`/`ElseStmt` con `peek()`/`next()` y flag `hasExecuted` para cortocircuito. `executeWhileStmt()` evalúa condición y ejecuta `body.children` en loop mientras sea verdadera. `executeDoWhileStmt()` ejecuta body al menos una vez. `executeForStmt()` evalúa start/end/step, loop con incremento (soporta step negativo).
- **Condicionales (sibling pattern)**: IfStmt, ElseIfStmt y ElseStmt viven como hermanos en `BlockStmt.children[]` (no como linked list con `elseBody`). El intérprete y validador usan `peek()`/`next()` y `statements[i + 1]` para consumirlos secuencialmente.
- **Eventos**: `editorChanged`, `sidebarInfoRecieved`, `sidebarInfoSended` — pub/sub con `Event<T>` class.
- **Sidebar**: event-driven request/response vía `useSidebarStore.send()`. Componentes pasan `{ title, style, icon, options }[]` donde `icon` se renderiza en el tab. Las secciones se construyen desde `statementsGroups`/`expressionsGroups` (cada grupo tiene su `sectionColor` que resuelve a `sectionColorMap`).
- **ExprCtx**: provee `{ expr, parent, edit }` a componentes de expresión. Los hijos llaman `edit(newExpr)` para reemplazar, y `updateAt()` para persistir.
- **Hooks útiles**: `useVariableIdentifiers()` recolecta variables definidas en ámbito. `useVariableType()` devuelve función `(id) => Type` para resolver tipo de variable. `useVariableUpdateReferences(oldId, newId, type)` renombra y actualiza tipo de todas las `VariableExpr`/`AssignExpr` que referencian `oldId`, recorriendo recursivamente statements y sub-expresiones vía `exploreToVariableExprs()`.
  - **⚠️ `exploreToVariableExprs()` no atraviesa `condition`/`thenBody`/`body` de IfStmt/ElseIfStmt/ElseStmt/WhileStmt/DoWhileStmt** — renombrar variables no encontrará referencias dentro de condicionales/bucles.
- **Colores de statements**: los colores se definen por grupo en `src/lib/blocks/statements/records/groups.ts` via `blockColor`. `StmtBlock` resuelve `blockColorMap[group.blockColor]` para bg/text/border.
- **Colores de expresiones**: `typeStyles(type: PrimaryType)` en `src/lib/type-styles.ts` (`bg`, `text`, `border`, `ring`). `ExprBlock` deriva colores directamente de `expr.type`.
- **Theme system** (`src/lib/theme.ts`): `blockColorMap` y `sectionColorMap` con strings literales completas (p.ej. `bg-sky-200 text-sky-900 border-sky-400`). Tailwind las detecta en build porque son literales en el source.
- **VariableExpr.edit(identifier, type)**: segundo parámetro `type` es obligatorio para actualizar `expr.type`.
- **AssignExpr.copy()**: preserva `expr.type`.
- **UI components**: `Button` (`src/components/ui/button.tsx`) con props `size` (`xs`/`sm`/`md`), `shape`, `variant`, `icon` (componente `@tabler/icons-react`). `Input` (`src/components/blocks/ui/input.tsx`) con estilos base. `Confirm` (`src/components/ui/confirm.tsx`) diálogo modal con `title`, `description`, `onAccept`, `onCancel`, `open`.
- **No hay tests** configurados.
- **Iconos**: `@tabler/icons-react`. `GroupConfig` incluye `icon` de tipo `ComponentType`.
- **Font**: Cascadia Code via Google Fonts (preconnect en index.html).
- **Animaciones**: `tailwind-animations` (`^1.0.1`) disponible vía `animate-fade-in`, `animate-duration-normal`, etc. Importado en `src/index.css`.
- **Formato valores**: `null` → `'nulo'`, `boolean` → `'verdadero'/'falso'`, resto → `String(value)`.
- **IDs**: `crypto.randomUUID()` en constructor de `Stmt`, preservado en `copy()`.
- **Serializer** (`src/lib/serializer.ts`): `serialize(node)` recorre `Object.keys` y aplane recursivamente Stmt/Expr a JSON. `deserialize(data)` usa `statementsClasses`/`expressionsClasses` para reconstruir el árbol. Soporta todos los tipos de Stmt/Expr automáticamente.
- **Persistence**: `GlobalStmtProvider` auto-guarda en `localStorage` (`blockscript-save`) cada 5 segundos con debounce. `OutputProvider` guarda también al ejecutar (`run()`). Estado inicial se carga desde `localStorage`. `usePersistence(stmt)` provee `exportToFile()` que descarga `blockscript-YYYY-MM-DD.bs`.
- **Zoom/Pan**: `react-zoom-pan-pinch` con `TransformWrapper` + `TransformComponent`. Zoom con rueda+Ctrl o botones. Botón de reset centrado.
- **SEO**: `index.html` con `lang=es`, meta description, Open Graph, Twitter Cards, canonical. `public/robots.txt`, `public/sitemap.xml`, `public/manifest.json` (PWA).

## Expresiones (16)

| Clase | name | Props | `type` |
|---|---|---|---|
| `NumberLiteralExpr` | `number-expr` | `literal: number = 0` | `número` |
| `StringLiteralExpr` | `string-expr` | `literal: string = ''` | `texto` |
| `BooleanLiteralExpr` | `boolean-expr` | `literal: boolean = false` | `V / F` |
| `NullLiteralExpr` | `null-literal` | `literal: null` | `nulo` |
| `BinaryExpr` | `binary-expr` | `left, operator: BinaryOp, right` | `número` |
| `BinaryCompExpr` | `binary-comp-expr` | `left, operator: BinaryCompOp, right` | `V / F` |
| `ConcatExpr` | `concat-expr` | `left, right: Expr` | `texto` |
| `ToStringExpr` | `to-string-expr` | `expression: Expr` | `texto` |
| `ToNumberExpr` | `to-number-expr` | `expression: Expr` | `número` |
| `ToBooleanExpr` | `to-boolean-expr` | `expression: Expr` | `V / F` |
| `LogicalExpr` | `logical-expr` | `left, operator: LogicalOp, right` | `V / F` |
| `VariableExpr` | `variable-expr` | `identifier: string = ''` | según variable |
| `AssignExpr` | `assign-expr` | `identifier, expression: Expr` | según expresión |
| `ReadExpr` | `read-expr` | `prompt: Expr` | `texto` |
| `AssignOpExpr` | `assign-op-expr` | `identifier, operator: AssignOp, expression: Expr` | `número` |
| `IncrementExpr` | `increment-expr` | `identifier: string, operator: IncrementOp` | `número` |

**BinaryOp**: `Add='+' Sub='-' Mul='*' Div='/' Mod='%'` **BinaryCompOp**: `Gt='>' Lt='<' Gte='>=' Lte='<=' Eq='==' Neq='!='` **LogicalOp**: `And='Y' Or='O'` **AssignOp**: `AddAssign='+=' SubAssign='-=' MulAssign='*=' DivAssign='/='` **IncrementOp**: `Increment='++' Decrement='--'`

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

`Stmt` (abstract base) no se usa directamente, pero existe en enum.

## Validación

- `binary-expr`: ambos operandos deben ser `número`
- `binary-comp-expr` (excepto `==`, `!=`): ambos operandos `número`; para `==`/`!=`: tipos deben coincidir
- `concat-expr`: ambos operandos deben ser `texto`
- `to-string-expr`: cualquier tipo aceptado (no valida)
- `to-number-expr`: cualquier tipo aceptado (no valida)
- `to-boolean-expr`: cualquier tipo aceptado (no valida)
- `logical-expr`: ambos operandos deben ser `V / F`
- `read-expr`: prompt debe ser `texto`
- `variable-expr`: identifier debe existir en `Defineds`
- `assign-expr`: identifier debe existir, tipo debe coincidir con el declarado
- `variable-stmt`: identifier no duplicado en el mismo ámbito
- `BlockStmt` valida recursivamente hijos con nuevo `Defineds` que hereda del padre
- `if-stmt`: condition debe ser `V / F`; luego camina hermanos `ElseIfStmt`/`ElseStmt` con `statements[i + 1]`, incrementando `i` para saltarlos
- `else-if-stmt`/`else-stmt` huérfanos (sin IfStmt previo): `ErrorType.InvalidStatement`
- `while-stmt`: condition debe ser `V / F`; valida `body` recursivamente
- `do-while-stmt`: same as while-stmt
- `for-stmt`: `start`, `end`, `step` deben ser `número`; crea `Defineds` hijo con loop variable `número`; valida `body` recursivamente

## Colores

Los colores de expresiones se derivan exclusivamente de `PrimaryType` vía `typeStyles(expr.type)` en `src/lib/type-styles.ts` (`bg`, `text`, `border`, `ring`). `ExprBlock` deriva `bg`/`text`/`border` directamente de `expr.type`. Componentes hijos solo especifican overrides cuando el tipo es dinámico (VariableExpr, AssignExpr, BinaryCompExpr, ReadExpr).

| PrimaryType | Bg | Text | Ring | Expresiones que lo usan |
|---|---|---|---|---|
| `número` | `bg-red-200` | `text-red-800` | `ring-red-300` | NumberLiteral, Binary, ToNumber |
| `texto` | `bg-lime-200` | `text-lime-800` | `ring-lime-400` | StringLiteral, Concat, ToString, Read |
| `V / F` | `bg-purple-200` | `text-purple-800` | `ring-purple-300` | BooleanLiteral, BinaryComp, ToBoolean, Logical |
| `nulo` | `bg-amber-200` | `text-amber-800` | `ring-amber-300` | NullLiteral |

**VariableExpr** y **AssignExpr**: color dinámico según el tipo de la variable declarada (resuelto con `useVariableType()` o `expr.type`).

Statements usan colores por grupo (definidos en `groups.ts` via `blockColor`):

| Statement | Grupo | Bg | Border |
|---|---|---|---|
| ExprStmt | Expresiones | `bg-sky-200` | `border-sky-400` |
| VariableStmt | Variables | `bg-cyan-200` | `border-cyan-400` |
| PrintStmt | Salida | `bg-green-200` | `border-green-400` |
| IfStmt/ElseIfStmt/ElseStmt | Condicionales | `bg-rose-200` | `border-rose-400` |
| WhileStmt/DoWhileStmt/ForStmt | Bucles | `bg-amber-200` | `border-amber-400` |

## Grupos de sidebar (section-styles)

Los colores de sidebar se derivan de `sectionColorMap` en `src/lib/theme.ts`. Cada grupo define su `sectionColor`:

| Grupo | key | sectionColor |
|---|---|---|
| (expresiones) Valores | `valores` | amber |
| (expresiones) Operaciones | `operaciones` | red |
| (expresiones) Variables | `variables` | purple |
| (expresiones) Conversión | `conversion` | orange |
| (statements) Expresiones | `expresiones` | blue |
| (statements) Variables | `variables` | cyan |
| (statements) Salida | `salida` | green |
| (statements) Condicionales | `condicionales` | rose |
| (statements) Bucles | `bucles` | amber |

## Agregar expresión

1. `expressions/enum.ts` → agregar al enum
2. `expressions/classes/<grupo>/<name>.ts` → clase con `edit()`, `copy()`, `migrateFrom()`, `type`
3. `expressions/classes/index.ts` → export
4. `expressions/records/classes.ts`, `labels.ts`, `groups.ts`
5. `components/blocks/expressions/<grupo>/<name>.tsx` → componente
6. `components/blocks/expressions/expr.tsx` → dispatch `instanceof`
7. `validator/validator.ts` → `collectExprErrors` + validate type
8. `interpreter.ts` → `evaluate()`
9. `expressions/records/groups.ts` → grupo para sidebar
