import z from 'zod'
import {
  AssignOp,
  BinaryCompOp,
  BinaryOp,
  IncrementOp,
  LogicalOp,
} from '../blocks/expressions'
import { Expressions } from '../blocks/expressions/enum'
import { PrimaryType } from '../types'

export const exprIdSchema = z
  .string()
  .regex(/^expr=.+$/)
  .or(z.literal(''))
export type ExprId = `expr=${string}`
export type ExprOptions = { id: ExprId } & (
  | ExprOpt
  | StringExprOpt
  | NumberExprOpt
  | BooleanExprOpt
  | NullExprOpt
  | ReadExprOpt
  | BinaryExprOpt
  | BinaryCompExprOpt
  | LogicalExprOpt
  | VariableExprOpt
  | AssignExprOpt
  | AssignOpExprOpt
  | IncrementExprOpt
  | ToStringExprOpt
  | ToNumberExprOpt
  | ToBooleanExprOpt
  | ConcatExprOpt
)

export const exprSchema = z.object({
  type: z.enum(PrimaryType),
  name: z.literal(Expressions.Expression),
})
export type ExprOpt = z.infer<typeof exprSchema>

export const stringExprSchema = z.object({
  type: z.literal(PrimaryType.string),
  name: z.literal(Expressions.StringLiteral),
  literal: z.string(),
})
export type StringExprOpt = z.infer<typeof stringExprSchema>

export const numberExprSchema = z.object({
  type: z.literal(PrimaryType.number),
  name: z.literal(Expressions.NumberLiteral),
  literal: z.number(),
})
export type NumberExprOpt = z.infer<typeof numberExprSchema>

export const booleanExprSchema = z.object({
  type: z.literal(PrimaryType.boolean),
  name: z.literal(Expressions.BooleanLiteral),
  literal: z.boolean(),
})
export type BooleanExprOpt = z.infer<typeof booleanExprSchema>

export const nullExprSchema = z.object({
  type: z.literal(PrimaryType.null),
  name: z.literal(Expressions.NullLiteral),
  literal: z.null(),
})
export type NullExprOpt = z.infer<typeof nullExprSchema>

export const readExprSchema = z.object({
  type: z.literal(PrimaryType.string),
  name: z.literal(Expressions.Read),
  prompt: exprIdSchema,
})
export type ReadExprOpt = z.infer<typeof readExprSchema> & { prompt: ExprId }

export const binaryExprSchema = z.object({
  type: z.literal(PrimaryType.number),
  name: z.literal(Expressions.Binary),
  left: exprIdSchema,
  operator: z.enum(BinaryOp),
  right: exprIdSchema,
})
export type BinaryExprOpt = z.infer<typeof binaryExprSchema> & {
  left: ExprId
  right: ExprId
}

export const binaryCompExprSchema = z.object({
  type: z.literal(PrimaryType.boolean),
  name: z.literal(Expressions.BinaryComp),
  left: exprIdSchema,
  operator: z.enum(BinaryCompOp),
  right: exprIdSchema,
})
export type BinaryCompExprOpt = z.infer<typeof binaryCompExprSchema> & {
  left: ExprId
  right: ExprId
}

export const logicalExprSchema = z.object({
  type: z.literal(PrimaryType.boolean),
  name: z.literal(Expressions.Logical),
  left: exprIdSchema,
  operator: z.enum(LogicalOp),
  right: exprIdSchema,
})
export type LogicalExprOpt = z.infer<typeof logicalExprSchema> & {
  left: ExprId
  right: ExprId
}

export const variableExprSchema = z.object({
  type: z.enum(PrimaryType),
  name: z.literal(Expressions.Variable),
  identifier: z.string(),
})
export type VariableExprOpt = z.infer<typeof variableExprSchema>

export const assignExprSchema = z.object({
  type: z.enum(PrimaryType),
  name: z.literal(Expressions.Assign),
  identifier: z.string(),
  expr: exprIdSchema,
})
export type AssignExprOpt = z.infer<typeof assignExprSchema> & { expr: ExprId }

export const assignOpExprSchema = z.object({
  type: z.enum(PrimaryType),
  name: z.literal(Expressions.AssignOp),
  identifier: z.string(),
  operator: z.enum(AssignOp),
  expr: exprIdSchema,
})
export type AssignOpExprOpt = z.infer<typeof assignOpExprSchema> & {
  expr: ExprId
}

export const incrementExprSchema = z.object({
  type: z.enum(PrimaryType),
  name: z.literal(Expressions.Increment),
  identifier: z.string(),
  operator: z.enum(IncrementOp),
})
export type IncrementExprOpt = z.infer<typeof incrementExprSchema>

// 4. Expresiones de Conversión y Utilidad
export const toStringExprSchema = z.object({
  type: z.literal(PrimaryType.string),
  name: z.literal(Expressions.ToString),
  expr: exprIdSchema,
})
export type ToStringExprOpt = z.infer<typeof toStringExprSchema> & {
  expr: ExprId
}

export const toNumberExprSchema = z.object({
  type: z.literal(PrimaryType.number),
  name: z.literal(Expressions.ToNumber),
  expr: exprIdSchema,
})
export type ToNumberExprOpt = z.infer<typeof toNumberExprSchema> & {
  expr: ExprId
}

export const toBooleanExprSchema = z.object({
  type: z.literal(PrimaryType.boolean),
  name: z.literal(Expressions.ToBoolean),
  expr: exprIdSchema,
})
export type ToBooleanExprOpt = z.infer<typeof toBooleanExprSchema> & {
  expr: ExprId
}

export const concatExprSchema = z.object({
  type: z.literal(PrimaryType.string),
  name: z.literal(Expressions.Concat),
  left: exprIdSchema,
  right: exprIdSchema,
})
export type ConcatExprOpt = z.infer<typeof concatExprSchema> & {
  left: ExprId
  right: ExprId
}

export const expressionSchemas = {
  [Expressions.Expression]: exprSchema,
  [Expressions.StringLiteral]: stringExprSchema,
  [Expressions.NumberLiteral]: numberExprSchema,
  [Expressions.BooleanLiteral]: booleanExprSchema,
  [Expressions.NullLiteral]: nullExprSchema,
  [Expressions.Read]: readExprSchema,
  [Expressions.Binary]: binaryExprSchema,
  [Expressions.BinaryComp]: binaryCompExprSchema,
  [Expressions.Logical]: logicalExprSchema,
  [Expressions.Variable]: variableExprSchema,
  [Expressions.Assign]: assignExprSchema,
  [Expressions.AssignOp]: assignOpExprSchema,
  [Expressions.Increment]: incrementExprSchema,
  [Expressions.ToString]: toStringExprSchema,
  [Expressions.ToNumber]: toNumberExprSchema,
  [Expressions.ToBoolean]: toBooleanExprSchema,
  [Expressions.Concat]: concatExprSchema,
}

export const exprOptionsSchema = z.union(
  Object.values(expressionSchemas).map((schema) =>
    z.object({ id: exprIdSchema }).extend(schema.shape),
  ),
)
