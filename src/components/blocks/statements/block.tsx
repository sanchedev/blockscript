import { IconExclamationCircleFilled, IconPlus } from '@tabler/icons-react'
import { useLocationPath } from '../../../contexts/location-path'
import { useError } from '../../../hooks/error'
import type { BlockStmt } from '../../../lib/blocks/statements/classes'
import type { StmtCompProps } from './types'
import { StmtComp } from './stmt'
import { LocationProvider } from '../../../providers/location'
import { useGlobalStmt } from '../../../hooks/global-stmt'
import { useSidebarStore } from '../../../stores/sidebar-store'
import {
  statementsGroups,
  StatementsGroupKey,
} from '../../../lib/blocks/statements/records/groups'
import { statementsLabels } from '../../../lib/blocks/statements/records/labels'
import { statementsClasses } from '../../../lib/blocks/statements/records/classes'
import type { Statements } from '../../../lib/blocks/statements/enum'
import { Button } from '../../ui/button'
import clsx from 'clsx'
import { sectionColorMap } from '../../../lib/theme'

export function BlockStmtComp(
  props: StmtCompProps<BlockStmt> & {
    main?: boolean
    removeRoundedTop?: boolean
    removeRoundedBottom?: boolean
    fit?: boolean
  },
) {
  const { getErrorByLocation } = useError()
  const locationPath = useLocationPath()

  const { addAt } = useGlobalStmt()

  const pending = useSidebarStore((state) => state.pending)
  const send = useSidebarStore((state) => state.send)

  return (
    <div
      className={clsx(
        'border-l-2 border-slate-300 bg-slate-100 rounded-2xl p-10 flex flex-col gap-2 items-start shadow',
        {
          'rounded-t-none': props.removeRoundedTop,
          'rounded-b-none': props.removeRoundedBottom,
        },
        props.fit && 'w-fit',
      )}>
      {props.stmt.children.map((stmt, i) => {
        const line = i + 1
        const selfLoc = {
          index: i,
          stmt: stmt.name,
        }
        const selfPath = [...locationPath, selfLoc]
        const error = getErrorByLocation(...selfPath)

        const handleAdd = () => {
          const indexPath = selfPath.map(({ index }) => index)
          send(
            (
              Object.entries(statementsGroups) as [
                StatementsGroupKey,
                (typeof statementsGroups)[StatementsGroupKey],
              ][]
            ).map(([, { title, items, sectionColor, icon }]) => ({
              style: sectionColorMap[sectionColor],
              title,
              icon,
              options: items.map((stmt) => ({
                label: statementsLabels[stmt],
                value: stmt,
              })),
            })),
            (value) => {
              if (value == null) return
              addAt(new statementsClasses[value as Statements](), ...indexPath)
            },
          )
        }

        return (
          <div
            key={stmt.id}
            className='relative -ml-8 flex items-center gap-2 h-fit not-hover:[&>button]:hidden'>
            <Button
              size='xs'
              shape='square'
              className='absolute -top-4 left-2 animate-fade-in animate-duration-normal'
              icon={IconPlus}
              onClick={handleAdd}
            />
            <div className='w-6 h-full flex items-center justify-end text-right text-sm font-mono text-slate-400 select-none pt-1'>
              {error ? (
                <IconExclamationCircleFilled
                  className='text-red-400'
                  title={`${error.type}: ${error.message}`}
                />
              ) : (
                <span>{line}</span>
              )}
            </div>
            <LocationProvider location={{ index: i, stmt: stmt.name }}>
              <StmtComp stmt={stmt} />
            </LocationProvider>
          </div>
        )
      })}
      <Button
        title='Agrega un bloque'
        onClick={async () => {
          send(
            (
              Object.entries(statementsGroups) as [
                StatementsGroupKey,
                (typeof statementsGroups)[StatementsGroupKey],
              ][]
            ).map(([, { title, items, sectionColor, icon }]) => ({
              style: sectionColorMap[sectionColor],
              title,
              icon,
              options: items.map((stmt) => ({
                label: statementsLabels[stmt],
                value: stmt,
              })),
            })),
            (value) => {
              if (value == null) return
              addAt(
                new statementsClasses[value as Statements](),
                ...locationPath.slice(-1).map((l) => l.index),
                props.stmt.children.length,
              )
            },
          )
        }}
        disabled={pending}
        shape='square'
        icon={IconPlus}
      />
    </div>
  )
}
