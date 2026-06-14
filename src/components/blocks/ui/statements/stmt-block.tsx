import clsx from 'clsx'
import { getStmtGroupColor } from '../../../../lib/blocks/statements/records/groups'
import type { Statements } from '../../../../lib/blocks/statements/enum'

interface StmtBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

export function StmtBlock({ name, ...props }: StmtBlockProps) {
  const styles = getStmtGroupColor(name as Statements)

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
