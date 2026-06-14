import type { StmtId } from '../../../../lib/ui/stmts'
import { StmtBlock } from './stmt-block'
import { BlockStmtComp } from '../../statements/block'
import clsx from 'clsx'

interface StmtWithBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  top?: React.ReactNode
  bottom?: React.ReactNode
  bodyId: StmtId
  disabled: boolean
}

export function StmtWithBlock({
  name,
  top,
  bodyId,
  bottom,
  disabled,
  ...props
}: StmtWithBlockProps) {
  return (
    <div {...props} className={clsx('flex flex-col', props.className)}>
      <StmtBlock name={name} className='min-w-12 rounded-bl-none'>
        {top}
        <span>{'{'}</span>
      </StmtBlock>
      <BlockStmtComp id={bodyId} disabled={disabled} />
      <StmtBlock name={name} className='min-w-12 rounded-tl-none'>
        <span>{'}'}</span>
        {bottom}
      </StmtBlock>
    </div>
  )
}
