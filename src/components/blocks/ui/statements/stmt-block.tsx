import clsx from 'clsx'
import { getStmtGroupColor } from '../../../../lib/blocks/statements/records/groups'
import type { StmtCompProps } from '../../statements/types'

interface StmtBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, StmtCompProps {}

export function StmtBlock({ stmt, ...props }: StmtBlockProps) {
  const styles = getStmtGroupColor(stmt.name)

  return (
    <div
      {...props}
      className={clsx(
        'border-l-2 rounded-lg font-mono flex items-center px-1 gap-1 py-0.5 h-7 text-sm w-fit',
        styles.bg,
        styles.border,
        styles.text,
        props.className,
      )}></div>
  )
}
