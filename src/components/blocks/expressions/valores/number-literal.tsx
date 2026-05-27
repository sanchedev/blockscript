import type { NumberLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'

export function NumberLiteralExprComp(props: ExprCompProps<NumberLiteralExpr>) {
  const { updateAt } = useGlobalStmt()

  const handleChange = (value: string) => {
    const num = value === '' ? 0 : Number(value)
    if (!isNaN(num)) {
      props.expr.edit(num)
      updateAt()
    }
  }

  return (
    <ExprBlock {...props}>
      <div
        className={`rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 flex gap-0 w-24 min-w-12 resize-x items-center font-mono has-focus:ring-2 ${typeStyles(PrimaryType.number).ring} overflow-hidden`}>
        <input
          className='p-0 outline-0 w-full'
          type='number'
          value={props.expr.literal}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </ExprBlock>
  )
}
