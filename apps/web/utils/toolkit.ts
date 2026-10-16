import { HttpStatusCode } from '@/configs/constants'

import type { ActionState } from '@workspace/server/types/action'
import type { IssueActionState } from '@/types/action'

export function throwIfActionFailed(state: ActionState): void {
  if (state.status && state.status < HttpStatusCode.BadRequest) return
  throw new Error(state.message ?? '操作失敗，請再試一次')
}

export function getActionData<T>(state: IssueActionState<T>): T {
  throwIfActionFailed(state)
  if (state.data === undefined) throw new Error(state.message ?? '操作失敗，請再試一次')
  return state.data
}

export function getFormDataValue(formData: FormData, key: string) {
  const formDataValue = formData.get(key) ?? ''
  return `${formDataValue}`.trim()
}

export function isEqualWithCase(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

export function isRequestError(
  error: unknown,
): error is Error & { status: number } {
  return error instanceof Error && 'status' in error
}

export function isUnauthorizedError(error: unknown): boolean {
  return isRequestError(error) && error.status === HttpStatusCode.Unauthorized
}

export function isGraphqlNotFoundError(error: unknown): boolean {
  return error instanceof Error
    && 'errors' in error
    && Array.isArray(error.errors)
    && error.errors.some(item => item?.type === 'NOT_FOUND')
}

export function parsePositiveInt(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const num = Number(value)
  return Number.isInteger(num) && num > 0 ? num : null
}
