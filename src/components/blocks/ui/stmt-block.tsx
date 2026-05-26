import clsx from 'clsx'
import { useSidebarStore } from '../../../stores/sidebar-store'
import { statementsLabels } from '../../../lib/blocks/statements/records/labels'
import { statementsClasses } from '../../../lib/blocks/statements/records/classes'
import {
  IconArrowDown,
  IconArrowUp,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { statementsGroups } from '../../../lib/blocks/statements/records/groups'
import type { StmtCompProps } from '../statements/types'
import { useGlobalStmt } from '../../../hooks/global-stmt'
import { useLocationPath } from '../../../contexts/location-path'
import { Button } from '../../ui/button'
import { useState } from 'react'
import { Menu, MenuItem } from '../../ui/menu'
import { sectionStyles } from '../../../lib/blocks/statements/records/section-styles'

interface StmtBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, StmtCompProps {}

export function StmtBlock({ stmt, ...props }: StmtBlockProps) {
  const send = useSidebarStore((state) => state.send)
  const pending = useSidebarStore((state) => state.pending)
  const { getParent, move, getAt, stmtToBlockStmt, removeAt, replaceAt } =
    useGlobalStmt()
  const indexes = useLocationPath().map((p) => p.index)
  const countOfStmts = getParent().children.length

  const [open, setOpen] = useState(false)

  const handleMenu = () => {
    setOpen(!open)
  }

  const handleReplace = () => {
    send(
      statementsGroups
        .map(({ key, title, stmts }) => ({
          style: sectionStyles[key as keyof typeof sectionStyles],
          title,
          options: stmts.flatMap((value) =>
            value === stmt.name
              ? []
              : {
                  label:
                    statementsLabels[value as keyof typeof statementsLabels],
                  value,
                },
          ),
        }))
        .filter((section) => section.options.length > 0),
      (value) => {
        if (value == null) return

        const newStmt = new statementsClasses[
          value as keyof typeof statementsClasses
        ]()
        newStmt.migrateFrom(stmt)
        replaceAt(newStmt)
      },
    )
  }

  const canGoUp = () => {
    return indexes.at(-1)! > 0 || indexes.length > 1
  }

  const handleUp = () => {
    if (!canGoUp()) return
    const path = [...indexes.slice(0, -1), indexes.at(-1)! - 1]

    if (path.at(-1)! < 0 && path.length > 1) {
      path.pop()
      move(...path)
      return
    }

    const stmt = stmtToBlockStmt(getAt(...path))
    if (stmt != null) {
      path.push(stmt.children.length)
    }

    move(...path)
  }

  const canGoDown = () => {
    return indexes.at(-1)! < countOfStmts - 1 || indexes.length > 1
  }

  const handleDown = () => {
    if (!canGoDown()) return
    const path = [...indexes.slice(0, -1), indexes.at(-1)! + 1]

    if (path.at(-1)! >= countOfStmts && path.length > 1) {
      path.pop()
      path[path.length - 1]++
      move(...path)
      return
    }

    const stmt = stmtToBlockStmt(getAt(...path))
    if (stmt != null) {
      path[path.length - 1]--
      path.push(0)
    }

    move(...path)
  }

  const handleDelete = () => {
    removeAt()
  }

  return (
    <div
      {...props}
      className={clsx(
        'border-l-2 p-1 rounded-xl h-fit flex flex-row items-center gap-2 w-fit font-mono shadow shadow-current/25',
        props.className,
      )}
      onMouseLeave={() => setOpen(false)}>
      <div className='flex-1'>{props.children}</div>
      <div className='relative flex w-8 transition-all stmt-tools'>
        <Button
          className='size-7'
          disabled={pending}
          onClick={handleMenu}
          size='sm'
          shape='square'
          aria-label='Menu'>
          <IconDotsVertical className='size-full' />
        </Button>
        <Menu className='-bottom-16 left-full' hidden={!open}>
          <MenuItem disabled={pending} action={handleReplace}>
            <IconPencil className='size-4 inline' /> Reemplazar
          </MenuItem>
          <div className='flex gap-0 divide-x divide-gray-100'>
            <MenuItem
              className='flex-1'
              textAlign='center'
              disabled={pending || !canGoUp()}
              action={handleUp}
              aria-label='Subir'>
              <IconArrowUp className='size-4 inline' />
            </MenuItem>
            <MenuItem
              className='flex-1'
              textAlign='center'
              disabled={pending || !canGoDown()}
              action={handleDown}
              aria-label='Bajar'>
              <IconArrowDown className='size-4 inline' />
            </MenuItem>
          </div>
          <MenuItem
            disabled={pending}
            action={handleDelete}
            variant='destructive'>
            <IconTrash className='size-4 inline' /> Eliminar
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}
