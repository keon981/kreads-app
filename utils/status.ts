import { HTTP_STATUS } from '@/types/http-status'

export function isRequestError(
  error: unknown,
): error is Error & { status: number } {
  return error instanceof Error && 'status' in error
}

export function isUnauthorizedError(error: unknown): boolean {
  return isRequestError(error) && error.status === HTTP_STATUS.UNAUTHORIZED
}
