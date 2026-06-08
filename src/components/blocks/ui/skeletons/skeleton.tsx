import { Expr } from '../../../../lib/blocks/expressions'
import { Stmt } from '../../../../lib/blocks/statements'
import { ExprComp } from '../../expressions/expr'
import { StmtComp } from '../../statements/stmt'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  obj: Stmt | Expr
  position?: { x: number; y: number }
}

export function Skeleton({ obj, position, ...rest }: SkeletonProps) {
  if (obj instanceof Expr)
    return <ExprComp expr={obj} position={position} disabled {...rest} />
  return <StmtComp stmt={obj} position={position} disabled {...rest} />
}
