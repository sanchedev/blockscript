import clsx from 'clsx'
import {
  statementsGroups,
  getStmtGroupKey,
} from '../../../lib/blocks/statements/records/groups'
import type { StmtCompProps } from '../statements/types'
import { Statements } from '../../../lib/blocks/statements/enum'
import { blockColorMap } from '../../../lib/theme'
import type { ItemStyle } from '../../../lib/blocks/shared/group-types'

interface StmtBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, StmtCompProps {
  overrideStyles?: Partial<ItemStyle>
}

export function StmtBlock({ stmt, overrideStyles, ...props }: StmtBlockProps) {
  const groupKey = getStmtGroupKey(stmt.name as Statements)
  const group = statementsGroups[groupKey]
  const styles = { ...blockColorMap[group.blockColor], ...overrideStyles }

  return (
    <div
      {...props}
      className={clsx(
        'border-l-2 p-1 rounded-xl h-fit flex flex-row items-center gap-2 w-fit font-mono shadow shadow-current/25',
        styles.bg,
        styles.text,
        styles.border,
        props.className,
      )}>
      <div className='flex-1'>{props.children}</div>
    </div>
  )
}
