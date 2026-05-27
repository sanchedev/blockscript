# BlockScript

Editor visual de programación por bloques. React 19 + TypeScript 6 + Vite 8 + TailwindCSS 4 + Zustand 5.

## Stack

- **React 19** — UI
- **TypeScript 6** — tipado
- **Vite 8** — build tool
- **TailwindCSS 4** — estilos
- **Zustand 5** — solo sidebar
- **react-zoom-pan-pinch** — zoom/pan canvas
- **@tabler/icons-react** — iconos

## Comandos

```bash
pnpm dev       # dev server
pnpm build     # tsc -b && vite build
pnpm lint      # eslint
pnpm preview   # vite preview
```

## Arquitectura

- **Statements** (11 clases): `IfStmt`, `ElseIfStmt`, `ElseStmt`, `WhileStmt`, `DoWhileStmt`, `ForStmt`, `PrintStmt`, `VariableStmt`, `ExprStmt`, `BlockStmt`, `Stmt` (abstract).
- **Expressions** (16 clases): literales, operaciones binarias/lógicas, variables/asignación, conversión. Organizadas en `valores/`, `operaciones/`, `variables/`, `conversion/`.
- **Entrypoint**: `src/main.tsx` → `App.tsx` → `Header` + `Entry` (editor con zoom/pan) + `Sidebar` + `Console`.
- **CRUD**: basado en path de índices (`addAt`, `removeAt`, `replaceAt`, `move`, `updateAt`, `replaceStmt`).
- **Colores**: sistema centralizado en `src/lib/theme.ts` con `blockColorMap` (para bloques) y `sectionColorMap` (para sidebar), ambos definidos con strings literales completas para detección de Tailwind.
- **Grupos**: tanto statements como expressions usan `GroupConfig` con `{ title, items, blockColor, sectionColor, icon }` en `Record<EnumKey, GroupConfig>`.
  - Statements: `StatementsGroupKey` (`Expresiones`, `Variables`, `Salida`, `Condicionales`, `Bucles`)
  - Expressions: `ExpressionsGroupKey` (`Valores`, `Operaciones`, `Variables`, `Conversion`)
- **Colores por tipo**: `typeStyles(type: PrimaryType)` en `src/lib/type-styles.ts` deriva bg/text/border/ring del tipo de dato.
- **SEO**: meta tags, Open Graph, Twitter Cards, robots.txt, sitemap.xml, manifest.json PWA.
- **Persistencia**: auto-guarda en localStorage cada 5s + al ejecutar. Export/import `.bs` via `serialize()`/`deserialize()`.
