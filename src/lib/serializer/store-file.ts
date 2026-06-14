import {
  exprIdSchema,
  exprOptionsSchema,
  type ExprId,
  type ExprOptions,
} from '../ui/exprs'
import {
  stmtIdSchema,
  stmtOptionsSchema,
  type StmtId,
  type StmtOptions,
} from '../ui/stmts'
import { useTreeStore } from '../../stores/tree-store'
import {
  useBlockDragStore,
  type DragBlockId,
} from '../../stores/block-drag-store'
import z from 'zod'

const storeFileSchema = z.object({
  version: z.literal(1),
  stmts: z.record(stmtIdSchema, stmtOptionsSchema),
  exprs: z.record(exprIdSchema, exprOptionsSchema),
  rootId: stmtIdSchema,
  positions: z.array(
    z.object({
      id: z.union([stmtIdSchema, exprIdSchema]),
      x: z.number(),
      y: z.number(),
    }),
  ),
})

export type StoreFile = z.infer<typeof storeFileSchema>

export function exportStoreFile(): StoreFile {
  const store = useTreeStore.getState()
  const drag = useBlockDragStore.getState()

  return {
    version: 1,
    stmts: JSON.parse(JSON.stringify(store.stmts)),
    exprs: JSON.parse(JSON.stringify(store.exprs)),
    rootId: store.rootId,
    positions: drag.positions.map((p) => ({ ...p })),
  }
}

export function importStoreFile(rawData: unknown): void {
  const data = storeFileSchema.parse(rawData)

  useTreeStore.setState({
    stmts: data.stmts as Record<StmtId, StmtOptions>,
    exprs: data.exprs as Record<ExprId, ExprOptions>,
    rootId: data.rootId as StmtId,
  })

  useBlockDragStore.setState({
    positions: data.positions.map((p) => ({ ...p })) as {
      id: DragBlockId
      x: number
      y: number
    }[],
  })
}
