import { environmentManager, MutationCache, QueryClient } from '@tanstack/react-query'

import { SECONDS } from '@workspace/ui/configs/constants'

let browserQueryClient: QueryClient | undefined

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
      },
    },
  })
}

export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient()

  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
