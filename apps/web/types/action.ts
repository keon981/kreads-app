export interface ActionState {
  message?: string
  status?: number
}

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
