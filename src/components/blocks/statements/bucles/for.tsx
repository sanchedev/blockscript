import type { StmtCompProps } from '../types'
import type { ForStmt } from '../../../../lib/blocks/statements'
import { ExprContainerComp } from '../../ui/expr-container'
import { use } from 'react'
import { StmtCtx } from '../../../../contexts/stmt'
import clsx from 'clsx'
import { Input } from '../../ui/input'
import { typeStyles } from '../../../../lib/type-styles'
import { PrimaryType } from '../../../../lib/types'
import { StmtWithBlock } from '../../ui/statements/stmt-with-block'

export function ForStmtComp(props: StmtCompProps<ForStmt>) {
  const { triggerUpdate } = use(StmtCtx)

  const handleIdentifierChange = (value: string) => {
    props.stmt.changeIdentifier(value)
    triggerUpdate()
  }

  return (
    <StmtWithBlock
      stmt={props.stmt}
      top={
        <>
          <span>para</span>
          <label
            className={clsx(
              'flex rounded-lg font-mono has-focus-visible:ring-2 h-6',
              typeStyles(PrimaryType.number).text,
              typeStyles(PrimaryType.number).bg,
              typeStyles(PrimaryType.number).ring,
            )}>
            <Input
              autoFocus
              autoComplete='off'
              className={clsx(
                'p-0 outline-0 text-center w-full text-sm',
                'bg-gray-50 border-x-2 border-slate-300 rounded-lg min-w-12',
              )}
              value={props.stmt.identifier}
              onChange={(ev) => handleIdentifierChange(ev.target.value)}
              style={{ width: props.stmt.identifier.length + 2 + 'ch' }}
            />
          </label>
          <span>desde</span>
          <ExprContainerComp container={props.stmt.start} />
          <span>hasta</span>
          <ExprContainerComp container={props.stmt.end} />
          <span>paso</span>
          <ExprContainerComp container={props.stmt.step} />
        </>
      }
      block={props.stmt.body}
    />
  )
}
