import type { NullLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { Input } from '../../ui/input'
import type { ExprCompProps } from '../types'

export function NullLiteralExprComp(props: ExprCompProps<NullLiteralExpr>) {
  return (
    <ExprBlock {...props}>
      <Input
        type='text'
        value='nulo'
        disabled
        readOnly
        className='text-center w-18 font-mono'
      />
    </ExprBlock>
  )
}
