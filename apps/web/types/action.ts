import type { ActionState } from '@workspace/server/types/action'

export interface IssueFormState extends ActionState {
  content?: string
}

export type IssueFormAction = (prev: IssueFormState, formData: FormData) => Promise<IssueFormState>

export interface IssueTarget {
  repoName?: string
  issueNumber?: number
  commentId?: number
}

export type IssueDeleteAction = (target: IssueTarget) => Promise<ActionState>
