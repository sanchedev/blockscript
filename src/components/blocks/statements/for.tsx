import type { StmtCompProps } from './types'
import type { ForStmt } from '../../../lib/blocks/statements'
import { ExprComp } from '../expressions/expr'
import { BlockStmtComp } from './block'
import { StmtBlock } from '../ui/stmt-block'
import { Input } from '../ui/input'
import { useGlobalStmt } from '../../../hooks/global-stmt'
import { useVariableUpdateReferences } from '../../../hooks/variables'
import { PrimaryType } from '../../../lib/types'

export function ForStmtComp(props: StmtCompProps<ForStmt>) {
  const { updateAt } = useGlobalStmt()
  const updateReferences = useVariableUpdateReferences()

  const handleIdentifierChange = (value: string) => {
    const oldId = props.stmt.identifier
    if (oldId !== value && oldId !== '') {
      updateReferences(oldId, value, PrimaryType.number)
    }
    props.stmt.edit(value, props.stmt.start, props.stmt.end, props.stmt.step)
    updateAt()
  }

  return (
    <div>
      <StmtBlock
        {...props}
        className='rounded-b-none w-full'>
        <div className='pl-2 flex gap-4 items-center flex-wrap'>
          <span>para</span>
          <Input
            value={props.stmt.identifier}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            placeholder='i'
            list='for-variables'
            className='w-20'
          />
          <span>desde</span>
          <ExprComp
            expr={props.stmt.start}
            parent={props.stmt}
            edit={(expr) =>
              props.stmt.edit(
                props.stmt.identifier,
                expr,
                props.stmt.end,
                props.stmt.step,
              )
            }
          />
          <span>hasta</span>
          <ExprComp
            expr={props.stmt.end}
            parent={props.stmt}
            edit={(expr) =>
              props.stmt.edit(
                props.stmt.identifier,
                props.stmt.start,
                expr,
                props.stmt.step,
              )
            }
          />
          <span>paso</span>
          <ExprComp
            expr={props.stmt.step}
            parent={props.stmt}
            edit={(expr) =>
              props.stmt.edit(
                props.stmt.identifier,
                props.stmt.start,
                props.stmt.end,
                expr,
              )
            }
          />
        </div>
      </StmtBlock>
      <BlockStmtComp stmt={props.stmt.body} removeRoundedTop />
    </div>
  )
}
