import type { ActionState } from '@/types/action'

export interface PostFormState extends ActionState {
  content?: string
}
