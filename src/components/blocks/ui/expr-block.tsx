import clsx from 'clsx'
import { useSidebarStore } from '../../../stores/sidebar-store'
import { expressionsLabels } from '../../../lib/blocks/expressions/records/labels'
import { expressionsClasses } from '../../../lib/blocks/expressions/records/classes'
import { IconPencil } from '@tabler/icons-react'
import { expressionsGroups } from '../../../lib/blocks/expressions/records/groups'
import type { ExprCompProps } from '../expressions/types'
import { useGlobalStmt } from '../../../hooks/global-stmt'
import { Button } from '../../ui/button'
import { typeStyles } from '../../../lib/type-styles'
import { sectionColorMap } from '../../../lib/theme'

interface ExprBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, ExprCompProps {}

export function ExprBlock({ edit, expr, ...props }: ExprBlockProps) {
  const send = useSidebarStore((state) => state.send)
  const pending = useSidebarStore((state) => state.pending)

  const { updateAt } = useGlobalStmt()

  const handleReplace = () => {
    send(
      (
        Object.entries(expressionsGroups) as [
          string,
          (typeof expressionsGroups)[keyof typeof expressionsGroups],
        ][]
      )
        .map(([, { title, items, sectionColor, icon }]) => ({
          style: sectionColorMap[sectionColor],
          title,
          icon,
          options: items.flatMap((value) =>
            value === expr.name
              ? []
              : {
                  label:
                    expressionsLabels[value as keyof typeof expressionsLabels],
                  value,
                },
          ),
        }))
        .filter((section) => section.options.length > 0),
      (value) => {
        if (value == null) return

        const newExpr = new expressionsClasses[
          value as keyof typeof expressionsClasses
        ]()
        newExpr.migrateFrom(expr)
        edit(newExpr)
        updateAt()
      },
    )
  }

  return (
    <div
      {...props}
      className={clsx(
        'border-l-2 rounded-xl h-fit flex flex-row items-center w-min hover:[&>.tools]:w-10 hover:[&>.tools]:ml-0 hover:[&>.tools]:opacity-100 hover:[&>.tools]:rotate-0 shadow shadow-current/25',
        typeStyles(expr.type).bg,
        typeStyles(expr.type).text,
        typeStyles(expr.type).border,
        props.className,
      )}>
      <div className='p-1'>{props.children}</div>
      <div className='flex gap-1 -ml-2 w-0 rotate-180 p-1 overflow-hidden transition-all opacity-0 tools'>
        <Button
          className='size-7'
          disabled={pending}
          onClick={handleReplace}
          shape='square'
          size='sm'
          aria-label='Reemplazar'
          icon={IconPencil}
        />
      </div>
    </div>
  )
}
