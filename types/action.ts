export interface ActionState {
  message?: string
  status?: number
}

export interface IssueFormState extends ActionState {
  content?: string
}

export type IssueFormAction = (prev: IssueFormState, formData: FormData) => Promise<IssueFormState>
