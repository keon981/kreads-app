import { environmentManager, MutationCache, QueryClient } from '@tanstack/react-query'

import { SECONDS } from '@workspace/ui/configs/constants'

import { HttpStatusCode } from '@/configs/constants'

const NON_RETRYABLE_STATUSES: number[] = [
  HttpStatusCode.Forbidden,
  HttpStatusCode.NotFound,
  HttpStatusCode.TooManyRequests,
]

let browserQueryClient: QueryClient | undefined

function canRetry(failureCount: number, error: Error): boolean {
  if (typeof error.cause === 'number' && NON_RETRYABLE_STATUSES.includes(error.cause)) return false
  return failureCount < 3
}

function makeQueryClient(): QueryClient {
  const mutationCache: MutationCache = new MutationCache({
    onSettled: (_data, error, _variables, _onMutateResult, mutation) => {
      if (!error) mutationCache.remove(mutation)
    },
  })

  return new QueryClient({
    mutationCache,
    defaultOptions: {
      queries: {
        staleTime: SECONDS.minute * 1000,
        refetchOnWindowFocus: false,
        retry: environmentManager.isServer() ? false : canRetry,
      },
    },
  })
}

export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient()

  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
