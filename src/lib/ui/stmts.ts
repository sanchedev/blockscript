import z from 'zod'
import { Statements } from '../blocks/statements/enum'
import { exprIdSchema, type ExprId } from './exprs'

export const stmtIdSchema = z
  .string()
  .regex(/^stmt=.+$/)
  .or(z.literal(''))
export type StmtId = `stmt=${string}`

export type StmtOptions = { id: StmtId } & (
  | StmtOpt
  | BlockStmtOpt
  | ExprStmtOpt
  | VariableStmtOpt
  | PrintStmtOpt
  | IfStmtOpt
  | ElseIfStmtOpt
  | ElseStmtOpt
  | WhileStmtOpt
  | DoWhileStmtOpt
  | ForStmtOpt
  | BreakStmtOpt
  | ContinueStmtOpt
  | WaitStmtOpt
)
// ...

export const stmtSchema = z.object({
  name: z.literal(Statements.Stmt),
})
export type StmtOpt = z.infer<typeof stmtSchema>

export const blockStmtSchema = z.object({
  name: z.literal(Statements.Block),
  stmts: z.array(stmtIdSchema),
})
export type BlockStmtOpt = Omit<z.infer<typeof blockStmtSchema>, 'stmts'> & {
  stmts: StmtId[]
}

export const exprStmtSchema = z.object({
  name: z.literal(Statements.Expr),
  expr: exprIdSchema,
})
export type ExprStmtOpt = z.infer<typeof exprStmtSchema> & { expr: ExprId }

export const variableStmtSchema = z.object({
  name: z.literal(Statements.Variable),
  identifier: z.string(),
  expr: exprIdSchema,
})
export type VariableStmtOpt = z.infer<typeof variableStmtSchema> & {
  expr: ExprId
}

export const printStmtSchema = z.object({
  name: z.literal(Statements.Print),
  expr: exprIdSchema,
})
export type PrintStmtOpt = z.infer<typeof printStmtSchema> & { expr: ExprId }

export const ifStmtSchema = z.object({
  name: z.literal(Statements.If),
  condition: exprIdSchema,
  body: stmtIdSchema,
})
export type IfStmtOpt = z.infer<typeof ifStmtSchema> & {
  condition: ExprId
  body: StmtId
}

export const elseIfStmtSchema = z.object({
  name: z.literal(Statements.ElseIf),
  condition: exprIdSchema,
  body: stmtIdSchema,
})
export type ElseIfStmtOpt = z.infer<typeof elseIfStmtSchema> & {
  condition: ExprId
  body: StmtId
}

export const elseStmtSchema = z.object({
  name: z.literal(Statements.Else),
  body: stmtIdSchema,
})
export type ElseStmtOpt = z.infer<typeof elseStmtSchema> & { body: StmtId }

export const whileStmtSchema = z.object({
  name: z.literal(Statements.While),
  condition: exprIdSchema,
  body: stmtIdSchema,
})
export type WhileStmtOpt = z.infer<typeof whileStmtSchema> & {
  condition: ExprId
  body: StmtId
}

export const doWhileStmtSchema = z.object({
  name: z.literal(Statements.DoWhile),
  condition: exprIdSchema,
  body: stmtIdSchema,
})
export type DoWhileStmtOpt = z.infer<typeof doWhileStmtSchema> & {
  condition: ExprId
  body: StmtId
}

export const forStmtSchema = z.object({
  name: z.literal(Statements.For),
  identifier: z.string(),
  start: exprIdSchema,
  end: exprIdSchema,
  step: exprIdSchema,
  body: stmtIdSchema,
})
export type ForStmtOpt = z.infer<typeof forStmtSchema> & {
  start: ExprId
  end: ExprId
  step: ExprId
  body: StmtId
}

export const breakStmtSchema = z.object({
  name: z.literal(Statements.Break),
})
export type BreakStmtOpt = z.infer<typeof breakStmtSchema>

export const continueStmtSchema = z.object({
  name: z.literal(Statements.Continue),
})
export type ContinueStmtOpt = z.infer<typeof continueStmtSchema>

export const waitStmtSchema = z.object({
  name: z.literal(Statements.Wait),
  duration: exprIdSchema,
})
export type WaitStmtOpt = z.infer<typeof waitStmtSchema> & { duration: ExprId }

export const statementsSchemas = {
  [Statements.Stmt]: stmtSchema,
  [Statements.Block]: blockStmtSchema,
  [Statements.Expr]: exprStmtSchema,
  [Statements.Variable]: variableStmtSchema,
  [Statements.Print]: printStmtSchema,
  [Statements.If]: ifStmtSchema,
  [Statements.ElseIf]: elseIfStmtSchema,
  [Statements.Else]: elseStmtSchema,
  [Statements.While]: whileStmtSchema,
  [Statements.DoWhile]: doWhileStmtSchema,
  [Statements.For]: forStmtSchema,
  [Statements.Break]: breakStmtSchema,
  [Statements.Continue]: continueStmtSchema,
  [Statements.Wait]: waitStmtSchema,
}

export const stmtOptionsSchema = z.union(
  Object.values(statementsSchemas).map((schema) =>
    z.object({ id: stmtIdSchema }).extend(schema.shape),
  ),
)
