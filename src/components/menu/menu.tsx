import { useState, type ReactNode } from 'react'
import { useMenu } from '../../stores/menu-store'
import { MenuSection } from './menu-section'
import { MenuSelectorBtn } from './menu-selector-btn'
import { IconCodeVariable, IconListLetters } from '@tabler/icons-react'
import { expressionsGroups } from '../../lib/blocks/expressions/records/groups'
import { statementsGroups } from '../../lib/blocks/statements/records/groups'
import { expressionsLabels } from '../../lib/blocks/expressions/records/labels'
import { statementsLabels } from '../../lib/blocks/statements/records/labels'
import { expressionsClasses } from '../../lib/blocks/expressions/records/classes'
import { useTransformContext } from 'react-zoom-pan-pinch'
import { statementsClasses } from '../../lib/blocks/statements/records/classes'
import { ExprSkeleton } from '../blocks/ui/skeletons/expr-skeleton'
import { StmtSkeleton } from '../blocks/ui/skeletons/stmt-skeleton'
import { useBlockDrag } from '../../hooks/block-drag'
import { useTreeStore } from '../../stores/tree-store'
import { createDefaultExprOptions, createDefaultStmtOptions } from '../../lib/ui/default-options'
import { Expressions } from '../../lib/blocks/expressions/enum'
import { Statements } from '../../lib/blocks/statements/enum'

const menuSections = {
  expr: {
    key: 'expr',
    title: 'Expresiones',
    icon: IconCodeVariable,
    style: 'sky',
    options: Object.entries(expressionsGroups).map(
      ([key, { title, icon, items, sectionColor }]) => ({
        key,
        title,
        icon,
        items: items.map((value) => ({
          label: expressionsLabels[value],
          value,
        })),
        sectionColor,
      }),
    ),
  },
  stmt: {
    key: 'stmt',
    title: 'Declaraciones',
    icon: IconListLetters,
    style: 'red',
    options: Object.entries(statementsGroups).map(
      ([key, { title, icon, items, sectionColor }]) => ({
        key,
        title,
        icon,
        items: items.map((value) => ({
          label: statementsLabels[value],
          value,
        })),
        sectionColor,
      }),
    ),
  },
} as const

export function Menu() {
  const [selected, setSelected] = useState<keyof typeof menuSections>('expr')
  const isOpen = useMenu((state) => state.isOpen)

  const { add } = useBlockDrag()

  const { state } = useTransformContext()

  if (!isOpen) return null

  const handleSelected = ({
    section,
    value,
  }: {
    section: string
    value: string
  }) => {
    const option = menuSections[selected].options.find(
      ({ key }) => section === key,
    )
    if (option == null) return
    const item = option.items.find(({ value: v }) => v === value)
    if (item == null) return
    const { positionX, positionY } = state

    const x = positionX - window.innerWidth / 2
    const y = positionY - window.innerHeight / 2

    const store = useTreeStore.getState()

    if (selected === 'expr') {
      const opt = createDefaultExprOptions(value as Expressions)
      store.setExpr(opt.id, opt)
      add(opt.id, x, y)
    } else {
      const opt = createDefaultStmtOptions(value as Statements)
      store.setStmt(opt.id, opt)
      if (opt.name === Statements.If || opt.name === Statements.ElseIf || opt.name === Statements.Else ||
          opt.name === Statements.While || opt.name === Statements.DoWhile || opt.name === Statements.For) {
        const body: import('../../lib/ui/stmts').StmtOptions = {
          id: (opt as import('../../lib/ui/stmts').IfStmtOpt | import('../../lib/ui/stmts').WhileStmtOpt | import('../../lib/ui/stmts').ForStmtOpt).body,
          name: Statements.Block,
          stmts: [],
        }
        store.setStmt(body.id, body)
      }
      add(opt.id, x, y)
    }
  }

  const section = menuSections[selected]

  return (
    <aside
      className='fixed z-30 top-16 left-0 bottom-0 w-md max-w-[100vw] flex transition-colors bg-white border-r-2 border-gray-200 shadow'
      onWheel={(ev) => ev.stopPropagation()}>
      <ul className='flex flex-col w-20 p-2 gap-1 h-full border-r-2 border-gray-200'>
        {Object.values(menuSections).map(({ key, title, icon, style }) => (
          <li key={'selector-' + key}>
            <MenuSelectorBtn
              title={title}
              icon={icon}
              style={style}
              selected={selected === key}
              onSelect={() => setSelected(key)}
            />
          </li>
        ))}
      </ul>
      <MenuSection
        title={section.title}
        options={section.options}
        style={section.style}
        onSelect={handleSelected}
        itemRenderer={({
          value,
          onSelect,
        }: {
          value: string
          onSelect: () => void
        }): ReactNode => {
          const cls =
            expressionsClasses[value as keyof typeof expressionsClasses]
          const clsStmt =
            statementsClasses[value as keyof typeof statementsClasses]
          return (
            <button
              className='outline-none focus-visible:ring-2 ring-slate-400 rounded-xl'
              onClick={onSelect}>
              {cls ? <ExprSkeleton expr={cls.default!} /> : null}
              {clsStmt ? <StmtSkeleton stmt={clsStmt.default!} /> : null}
            </button>
          )
        }}
      />
    </aside>
  )
}
