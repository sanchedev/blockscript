# BlockScript

Editor visual de programación por bloques. React 19 + TypeScript 6 + Vite 8 + TailwindCSS 4 + Zustand 5 (root-stmt, drag, menu, console).

> **Sync:** Cada cambio importante en statements, expressions, validación, colores o arquitectura debe registrarse tanto en `README.md` (visión pública) como en `AGENTS.md` (referencia operativa). Mantener ambos sincronizados.

## Comandos

```
pnpm dev          # dev server
pnpm build        # tsc -b && vite build
pnpm lint         # eslint
pnpm preview      # vite preview
```

## Arquitectura

- **Statements** (`src/lib/blocks/statements/classes/`) — `Stmt` (abstract, `id: string`, `name: Statements`, `static createFrom`, `export`, `copy`, `configSchema` con Zod), `BlockStmt` (raíz con `children: Stmt[]`), `ExprStmt`, `PrintStmt`, `VariableStmt`, `IfStmt`, `ElseIfStmt`, `ElseStmt`, `WhileStmt`, `DoWhileStmt`, `ForStmt`
  - Registros en `records/`: `classes.ts`, `labels.ts`, `groups.ts`
  - Enum `Statements`: `Stmt`, `Expr`, `Print`, `Variable`, `Block`, `If`, `ElseIf`, `Else`, `While`, `DoWhile`, `For`, `Wait`
- **Expressions** (`src/lib/blocks/expressions/classes/`) — `Expr` (abstract, `type: PrimaryType`, `static createFrom`, `export`, `copy`, `configSchema` con Zod), más 16 clases concretas organizadas en subdirectorios por grupo:
  - `valores/`: NumberLiteralExpr, StringLiteralExpr, BooleanLiteralExpr, NullLiteralExpr, ReadExpr
  - `operaciones/`: BinaryExpr, BinaryCompExpr, LogicalExpr
  - `variables/`: VariableExpr, AssignExpr, AssignOpExpr, IncrementExpr
  - `conversion/`: ConcatExpr, ToStringExpr, ToNumberExpr, ToBooleanExpr
  - Registros en `records/`: `classes.ts`, `labels.ts`, `groups.ts`
  - Enum `Expressions` con 17 valores (incluye `Expression` base, `AssignOp`, `Increment`, `ToNumber`, `ToBoolean`, `Logical`)
- **Componentes de expresiones** (`src/components/blocks/expressions/`) — mismo mirror de directorios que `classes/`:
  - `valores/`, `operaciones/`, `variables/`, `conversion/` con sus respectivos `.tsx`
- **State**: `useRootStmt` (Zustand) almacena el `BlockStmt` raíz. Cada `StmtComp`/`ExprComp` mantiene su propio `useState` local (copia de trabajo). La mutación fluye: hijo → `triggerUpdate()` → `copy()` → `setState()` local. `BlockStmtCtx` provee `edit(index, stmt)` y `remove(index)` que mutan el array del padre + `triggerUpdate()`.
  - `StmtCtx` provee `{ parent, triggerUpdate }` a statements hijos
  - `ExprCtx` provee `{ parent, triggerUpdate }` a expresiones hijas
  - `ExprContainerCtx` provee `{ container, triggerUpdate }` a `ExprComp` dentro de un contenedor
  - Errores vía `ErrorCtx` + `ErrorProvider`. Output vía `OutputCtx` + `OutputProvider`.
- **Field decorators** (`src/lib/blocks/shared/field-decorator.ts`): `@field.exprContainer({ validate, requiredMsg })` define validación inline en cada campo `ExprContainer`, con acceso a `validator(container, expr)` donde `container.parent` es la clase contenedora. `@field.scalar(schema)` para campos con Zod. `@field.blockStmt()` para hijos `BlockStmt`. El decorator registra metadata en `__fields` y asigna el validador al `ExprContainer` en el initializer.
- **Drag & drop**: `drag-store` (Zustand, `DragData` con `obj`, `pickPosition`, `unlock`) maneja el arrastre activo. `BlockDrag` wrapper (`src/components/blocks/ui/block-drag.tsx`) envuelve cada `StmtComp`/`ExprComp` haciéndolo draggable, ocultando el drag image nativo con `setDragImage(new Image(),0,0)`. Durante el drag, un `DragSkeleton` sigue al cursor y el original se vuelve `opacity-0`. `block-drag-store` (Zustand) almacena items flotantes con posición absoluta en el board.
  - `BlockStmtComp` acepta drop de statements flotantes (valida incompatibilidad: auto-referencia, duplicados)
  - `ExprContainerComp` acepta drop de expresiones flotantes con validación de tipo
  - `Board` renderiza `useBlockDrag().positions` (bloques flotantes) + `BlockStmtComp` raíz
- **Entrypoint**: `src/main.tsx` → `App.tsx` → `Header` + `Entry` (editor con zoom/pan via `react-zoom-pan-pinch`) + `Menu` + `Console`
- **Tipos**: `PrimaryType` enum con `número`, `texto`, `V / F`, `nulo`. `Expr.type` se asigna estáticamente en cada clase.
- **Serializer**: Zod schemas con `static configSchema`, `static createFrom(rawConfig)`, y `export()` en cada clase. `Stmt.createFrom()` y `Expr.createFrom()` delegan a la clase concreta via `statementsClasses`/`expressionsClasses`. Las bases definen `id` + `name`; cada concreta extiende con sus props.
- **Validator** (`src/lib/validator/validator.ts` + `defineds.ts`): `Defineds` class con scoping padre-hijo (soporta `BlockStmt` anidados). `validate()` recorre recursivamente, incluyendo hijos de `BlockStmt`.
  - IfStmt: valida `condition` tipo `V / F`, valida `thenBody` recursivamente, luego camina hermanos `ElseIfStmt`/`ElseStmt` con `statements[i + 1]`.
  - ElseIfStmt/ElseStmt huérfanos (sin IfStmt previo) → `ErrorType.InvalidStatement`.
  - WhileStmt: valida `condition` tipo `V / F`, valida `body` recursivamente.
  - DoWhileStmt: same as WhileStmt.
  - ForStmt: valida `start`, `end`, `step` como `número`; crea `Defineds` hijo con loop variable; valida `body` recursivamente.
- **Interpreter** (`src/lib/interpreter.ts`): `executeStatements()` usa `peek()`/`next()` dinámicos. `executeIfStmt()` evalúa condición, ejecuta `thenBody`, luego recorre hermanos `ElseIfStmt`/`ElseStmt` con `peek()`/`next()` y flag `hasExecuted` para cortocircuito. `executeWhileStmt()` evalúa condición y ejecuta `body.children` en loop mientras sea verdadera. `executeDoWhileStmt()` ejecuta body al menos una vez. `executeForStmt()` evalúa start/end/step, loop con incremento (soporta step negativo). `executeWaitStmt()` espera N ms via `await new Promise(r => setTimeout(r, N))`. El intérprete es **async**: todos los métodos de ejecución y evaluación devuelven `Promise`, lo que evita congelar la página en bucles largos.
- **Condicionales (sibling pattern)**: IfStmt, ElseIfStmt y ElseStmt viven como hermanos en `BlockStmt.children[]` (no como linked list con `elseBody`). El intérprete y validador usan `peek()`/`next()` y `statements[i + 1]` para consumirlos secuencialmente.
- **Eventos**: `editorChanged` — pub/sub con `Event` class.
- **Menú**: reemplaza la sidebar anterior. `Menu.tsx` con tabs de expresiones/declaraciones, search, y skeletons visuales como items clickables. Al clickear, crea una instancia via `ClassName.default` y la agrega a `useBlockDragStore().add()` como item flotante en el board.
- **Skeletons**: `Skeleton({ obj, position })` renderiza un `ExprComp`/`StmtComp` con `disabled` en una posición absoluta. `DragSkeleton` lo renderiza siguiendo al cursor durante el drag. Usados en el menú (reemplazando botones de texto) y como ghost durante drag. Colores derivados de `typeStyles()` para expresiones y `blockColorMap` para statements.
- **Hooks útiles**: `useVariableIdentifiers()` recolecta variables definidas en ámbito vía `Defineds`. `useVariableType()` resuelve tipo de variable por identifier. `VariableInput` component con `<datalist>` para autocompletado.
- **Colores de statements**: los colores se definen por grupo en `src/lib/blocks/statements/records/groups.ts` via `blockColor`. `StmtBlock` resuelve `blockColorMap[group.blockColor]` para bg/text/border.
- **Colores de expresiones**: `typeStyles(type: PrimaryType)` en `src/lib/type-styles.ts` (`bg`, `text`, `border`, `ring`). `ExprBlock` deriva colores directamente de `expr.type`.
- **Theme system** (`src/lib/theme.ts`): `blockColorMap` y `sectionColorMap` con strings literales completas (p.ej. `bg-sky-200 text-sky-900 border-sky-400`). Tailwind las detecta en build porque son literales en el source.
- **VariableExpr**: `changeIdentifier(identifier)` actualiza `identifier`. `changeType(type)` actualiza `type` (usado cuando se resuelve el tipo de la variable).
- **AssignExpr.copy()**: preserva `expr.type`.
- **UI components**: `Button` (`src/components/ui/button.tsx`) con props `size` (`xs`/`sm`/`md`), `shape`, `variant`, `icon` (componente `@tabler/icons-react`). `ResizeInput` (`src/components/blocks/ui/resize-input.tsx`) input que autoajusta ancho. `VariableInput` con `datalist`. `ExprContainerComp` drop target para expresiones.
- **No hay tests** configurados.
- **Iconos**: `@tabler/icons-react`. `GroupConfig` incluye `icon` de tipo `ComponentType`.
- **Font**: Cascadia Code via Google Fonts (preconnect en index.html).
- **Animaciones**: `tailwind-animations` (`^1.0.1`) disponible vía `animate-fade-in`, `animate-duration-normal`, etc. Importado en `src/index.css`.
- **Formato valores**: `null` → `'nulo'`, `boolean` → `'verdadero'/'falso'`, resto → `String(value)`.
- **IDs**: `crypto.randomUUID()` en constructor de `Stmt`/`Expr`, preservado en `copy()`.
- **Serializer via Zod**: `static configSchema` (Zod schema) en cada clase. `static createFrom(rawConfig)` parsea y construye. `export()` serializa a objeto. `Stmt.createFrom()`/`Expr.createFrom()` delegan por `name`. Persistencia: `GlobalStmtProvider` auto-guarda en `localStorage` (`blockscript-save`) cada 5 segundos con debounce. `usePersistence(stmt)` provee `exportToFile()` que descarga `blockscript-YYYY-MM-DD.bs`.
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
| `ConcatExpr` | `concat-expr` | `left, right: ExprContainer` | `texto` |
| `ToStringExpr` | `to-string-expr` | `expression: ExprContainer` | `texto` |
| `ToNumberExpr` | `to-number-expr` | `expression: ExprContainer` | `número` |
| `ToBooleanExpr` | `to-boolean-expr` | `expression: ExprContainer` | `V / F` |
| `LogicalExpr` | `logical-expr` | `left, operator: LogicalOp, right` | `V / F` |
| `VariableExpr` | `variable-expr` | `identifier: string = ''` | según variable |
| `AssignExpr` | `assign-expr` | `identifier, expression: ExprContainer` | según expresión |
| `ReadExpr` | `read-expr` | `prompt: ExprContainer` | `texto` |
| `AssignOpExpr` | `assign-op-expr` | `identifier, operator: AssignOp, expression: ExprContainer` | `número` |
| `IncrementExpr` | `increment-expr` | `identifier: string, operator: IncrementOp` | `número` |

**BinaryOp**: `Add='+' Sub='-' Mul='*' Div='/' Mod='%'` **BinaryCompOp**: `Gt='>' Lt='<' Gte='>=' Lte='<=' Eq='==' Neq='!='` **LogicalOp**: `And='Y' Or='O'` **AssignOp**: `AddAssign='+=' SubAssign='-=' MulAssign='*=' DivAssign='/=' ModAssign='%='` **IncrementOp**: `Increment='++' Decrement='--'`

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
- `wait-stmt`: `duration` debe ser `número`

## toString / pseudocódigo

Cada `Stmt` y `Expr` implementa `toString(): string` que produce pseudocódigo plano para mostrar en errores de consola. El formato es el `label \`código\`` (label en negrita, pseudocódigo entre backticks en gris).

- El `Expr` base retorna `'?'`. Cada clase concreta sobreescribe recursivamente.
- Los `ExprContainer` vacíos se muestran como `?`.
- `BlockStmt` joins sus hijos con `; ` dentro de `{ }`. Se usa `filter(Boolean)` para ignorar nulls.
- `@field.scalar` no necesita serializer extra — toString usa la propiedad directamente.

**Labels actualizados** (`src/lib/blocks/*/records/labels.ts`):
- Statements: `Sentencia`, `Expresión`, `Impresión`, `Variable`, `Bloque`, `Si`, `O si`, `Si no`, `Mientras`, `Hacer mientras`, `Para`, `Espera`
- Expressions: `Expresión`, `Texto`, `Nulo`, `Número`, `Booleano`, `Aritmética`, `Comparación`, `Variable`, `Asignación`, `Lectura`, `Concatenación`, `A texto`, `A número`, `A booleano`, `Lógico`, `Asign. compuesta`, `Incremento`

**Error display**: `Location` agrega `text?: string` (resultado de `stmt.toString()` al momento de la validación). El console muestra `Label \`pseudocódigo\`` para cada entry en `error.location`.

## Colores

Los colores de expresiones se derivan exclusivamente de `PrimaryType` vía `typeStyles(expr.type)` en `src/lib/type-styles.ts` (`bg`, `text`, `border`, `ring`). `ExprBlock` deriva `bg`/`text`/`border` directamente de `expr.type`. Componentes hijos solo especifican overrides cuando el tipo es dinámico (VariableExpr, AssignExpr, BinaryCompExpr, ReadExpr).

| PrimaryType | Bg | Text | Ring | Expresiones que lo usan |
|---|---|---|---|---|
| `número` | `bg-red-200` | `text-red-800` | `ring-red-300` | NumberLiteral, Binary, ToNumber, AssignOp, Increment |
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
| WaitStmt | Tiempo | `bg-yellow-200` | `border-yellow-400` |

## Grupos de menú (section-styles)

Los colores de menú se derivan de `sectionColorMap` en `src/lib/theme.ts`. Cada grupo define su `sectionColor`:

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
2. `expressions/classes/<grupo>/<name>.ts` → clase con `static default`, `static configSchema`, `static createFrom`, `copy()`, `export()`, `edit()`, `type`
2b. Agregar `@field.exprContainer({ validate(container, expr) { ... }, requiredMsg })` a cada campo `ExprContainer`, y `@field.scalar(z.enum(...))` a campos escalares
2c. Implementar `toString(): string` con pseudocódigo recursivo
3. `expressions/classes/index.ts` → export
4. `expressions/records/classes.ts`, `labels.ts`, `groups.ts`
5. `components/blocks/expressions/<grupo>/<name>.tsx` → componente
6. `components/blocks/expressions/expr.tsx` → dispatch `instanceof`
7. `components/blocks/ui/skeletons/expr-skeleton.tsx` → dispatch `instanceof`
8. `validator/validator.ts` → `collectExprErrors` + validate type
9. `interpreter.ts` → `evaluate()`
