import type { ActionState } from '@workspace/server/types/action'

export interface IssueTarget {
  repoName?: string
  issueNumber?: number
  commentId?: number
}

export interface IssueActionState<T> extends ActionState {
  data?: T
}
