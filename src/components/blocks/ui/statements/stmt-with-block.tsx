import type { StmtCompProps } from '../../statements/types'
import type { BlockStmt } from '../../../../lib/blocks/statements'
import { StmtBlock } from './stmt-block'
import { BlockStmtComp } from '../../statements/block'
import clsx from 'clsx'

interface StmtWithBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, StmtCompProps {
  top?: React.ReactNode
  bottom?: React.ReactNode
  block: BlockStmt
}

export function StmtWithBlock({
  stmt,
  top,
  block,
  bottom,
  ...props
}: StmtWithBlockProps) {
  return (
    <div {...props} className={clsx('flex flex-col', props.className)}>
      <StmtBlock stmt={stmt} className='min-w-12 rounded-bl-none'>
        {top}
        <span>{'{'}</span>
      </StmtBlock>
      <BlockStmtComp stmt={block} parent={stmt} />
      <StmtBlock stmt={stmt} className='min-w-12 rounded-tl-none'>
        <span>{'}'}</span>
        {bottom}
      </StmtBlock>
    </div>
  )
}
