import { HTTP_STATUS } from '@/constants'

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
  return isRequestError(error) && error.status === HTTP_STATUS.UNAUTHORIZED
}

export function isGraphqlNotFoundError(error: unknown): boolean {
  return error instanceof Error
    && 'errors' in error
    && Array.isArray(error.errors)
    && error.errors.some(item => item?.type === 'NOT_FOUND')
}
