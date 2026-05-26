import type { StringLiteralExpr } from '../../../../lib/blocks/expressions'
import { ExprBlock } from '../../ui/expr-block'
import type { ExprCompProps } from '../types'
import { useGlobalStmt } from '../../../../hooks/global-stmt'
import { PrimaryType } from '../../../../lib/types'
import { typeStyles } from '../../../../lib/type-styles'

export function StringLiteralExprComp(props: ExprCompProps<StringLiteralExpr>) {
  const { updateAt } = useGlobalStmt()

  const handleChange = (value: string) => {
    props.expr.edit(value)
    updateAt()
  }

  return (
    <ExprBlock {...props}>
      <div
        className={`rounded-lg border-2 border-slate-200 bg-white px-2 py-1 h-8 flex gap-0 w-36 min-w-12 resize-x items-center font-mono has-focus:ring-2 ${typeStyles[PrimaryType.string].ring} overflow-hidden`}>
        <span>"</span>
        <input
          className='p-0 outline-0 w-full'
          type='text'
          value={props.expr.literal}
          onChange={(e) => handleChange(e.target.value)}
        />
        <span>"</span>
      </div>
    </ExprBlock>
  )
}
