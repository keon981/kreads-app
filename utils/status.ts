import { HTTP_STATUS } from '@/utils/http-status'

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
