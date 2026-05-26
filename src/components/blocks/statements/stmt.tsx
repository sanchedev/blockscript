import {
  DoWhileStmt,
  ExprStmt,
  ForStmt,
  IfStmt,
  ElseIfStmt,
  ElseStmt,
  WhileStmt,
  PrintStmt,
  VariableStmt,
} from '../../../lib/blocks/statements'
import { DoWhileStmtComp } from './do-while'
import { ExprStmtComp } from './expr'
import { ForStmtComp } from './for'
import { IfStmtComp } from './if'
import { ElseIfStmtComp } from './else-if'
import { ElseStmtComp } from './else'
import { WhileStmtComp } from './while'
import { PrintStmtComp } from './print'
import { VariableStmtComp } from './variable'
import type { StmtCompProps } from './types'

export function StmtComp(props: StmtCompProps) {
  if (props.stmt instanceof ExprStmt) {
    return <ExprStmtComp {...(props as StmtCompProps<ExprStmt>)} />
  }
  if (props.stmt instanceof PrintStmt) {
    return <PrintStmtComp {...(props as StmtCompProps<PrintStmt>)} />
  }
  if (props.stmt instanceof VariableStmt) {
    return <VariableStmtComp {...(props as StmtCompProps<VariableStmt>)} />
  }
  if (props.stmt instanceof IfStmt) {
    return <IfStmtComp {...(props as StmtCompProps<IfStmt>)} />
  }
  if (props.stmt instanceof ElseIfStmt) {
    return <ElseIfStmtComp {...(props as StmtCompProps<ElseIfStmt>)} />
  }
  if (props.stmt instanceof ElseStmt) {
    return <ElseStmtComp {...(props as StmtCompProps<ElseStmt>)} />
  }
  if (props.stmt instanceof WhileStmt) {
    return <WhileStmtComp {...(props as StmtCompProps<WhileStmt>)} />
  }
  if (props.stmt instanceof DoWhileStmt) {
    return <DoWhileStmtComp {...(props as StmtCompProps<DoWhileStmt>)} />
  }
  if (props.stmt instanceof ForStmt) {
    return <ForStmtComp {...(props as StmtCompProps<ForStmt>)} />
  }
}
