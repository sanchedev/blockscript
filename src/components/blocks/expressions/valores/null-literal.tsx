import type { NullLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import { InputD } from '../../ui/input-d'
import type { ExprCompProps } from '../types'

export function NullLiteralExprComp(props: ExprCompProps<NullLiteralExpr>) {
  return (
    <ExprBlock {...props}>
      <InputD
        type='text'
        value='nulo'
        disabled
        readOnly
        className='text-center w-18 font-mono'
      />
    </ExprBlock>
  )
}
