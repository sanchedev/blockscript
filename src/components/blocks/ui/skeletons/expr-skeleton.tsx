import type { Expr } from '../../../../lib/blocks/expressions'
import {
  AssignExpr,
  AssignOpExpr,
  BinaryCompExpr,
  BinaryExpr,
  BooleanLiteralExpr,
  ConcatExpr,
  IncrementExpr,
  LogicalExpr,
  NullLiteralExpr,
  NumberLiteralExpr,
  StringLiteralExpr,
  ToBooleanExpr,
  ToNumberExpr,
  ToStringExpr,
  VariableExpr,
  ReadExpr,
} from '../../../../lib/blocks/expressions'
import { typeStyles } from '../../../../lib/type-styles'
import clsx from 'clsx'
import { PrimaryType } from '../../../../lib/types'

export function ExprSkeleton({ expr }: { expr: Expr }) {
  const styles = typeStyles(expr.type)

  if (expr instanceof NumberLiteralExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        {expr.literal}
      </span>
    )
  }

  if (expr instanceof StringLiteralExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        &quot;{expr.literal || '...'}&quot;
      </span>
    )
  }

  if (expr instanceof BooleanLiteralExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        {expr.literal ? 'verdadero' : 'falso'}
      </span>
    )
  }

  if (expr instanceof NullLiteralExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        nulo
      </span>
    )
  }

  if (expr instanceof ReadExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        leer...
      </span>
    )
  }

  if (expr instanceof BinaryExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <SlotExpr expr={expr.left.get()} />
        <span className={clsx(typeStyles(PrimaryType.number).text)}>{expr.operator}</span>
        <SlotExpr expr={expr.right.get()} />
      </span>
    )
  }

  if (expr instanceof BinaryCompExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <SlotExpr expr={expr.left.get()} />
        <span className={clsx(typeStyles(PrimaryType.boolean).text)}>{expr.operator}</span>
        <SlotExpr expr={expr.right.get()} />
      </span>
    )
  }

  if (expr instanceof LogicalExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <SlotExpr expr={expr.left.get()} />
        <span className='text-purple-700 font-bold'>{expr.operator}</span>
        <SlotExpr expr={expr.right.get()} />
      </span>
    )
  }

  if (expr instanceof ConcatExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <SlotExpr expr={expr.left.get()} />
        <span className='text-lime-700'>+</span>
        <SlotExpr expr={expr.right.get()} />
      </span>
    )
  }

  if (expr instanceof VariableExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        {expr.identifier || 'variable'}
      </span>
    )
  }

  if (expr instanceof AssignExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <span>{expr.identifier || 'variable'}</span>
        <span className='text-slate-500'>=</span>
        <SlotExpr expr={expr.expression.get()} />
      </span>
    )
  }

  if (expr instanceof AssignOpExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <span>{expr.identifier || 'variable'}</span>
        <span className={clsx(typeStyles(PrimaryType.number).text)}>{expr.operator}</span>
        <SlotExpr expr={expr.expression.get()} />
      </span>
    )
  }

  if (expr instanceof IncrementExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
        {expr.identifier || 'variable'}
        {expr.operator}
      </span>
    )
  }

  if (expr instanceof ToStringExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <span className='text-lime-700'>texto(</span>
        <SlotExpr expr={expr.expression.get()} />
        <span className='text-lime-700'>)</span>
      </span>
    )
  }

  if (expr instanceof ToNumberExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <span className='text-red-700'>número(</span>
        <SlotExpr expr={expr.expression.get()} />
        <span className='text-red-700'>)</span>
      </span>
    )
  }

  if (expr instanceof ToBooleanExpr) {
    return (
      <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm flex items-center gap-1 w-fit')}>
        <span className='text-purple-700'>booleano(</span>
        <SlotExpr expr={expr.expression.get()} />
        <span className='text-purple-700'>)</span>
      </span>
    )
  }

  return (
    <span className={clsx(styles.bg, styles.text, styles.border, 'border-l-2 rounded-xl px-2 py-1 font-mono text-sm')}>
      ?
    </span>
  )
}

function SlotExpr({ expr }: { expr: Expr | null }) {
  if (expr) return <ExprSkeleton expr={expr} />
  return (
    <span className='inline-block min-w-8 h-5 rounded border border-dashed border-slate-300 bg-slate-50' />
  )
}
